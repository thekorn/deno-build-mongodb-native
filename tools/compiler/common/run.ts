import { ensureDir, walk } from 'https://deno.land/std@0.114.0/fs/mod.ts';
import {
  basename,
  dirname,
  join,
  relative,
} from 'https://deno.land/std@0.114.0/path/posix.ts';
import { createRequire } from 'https://deno.land/std@0.114.0/node/module.ts';

const require = createRequire(import.meta.url);

const ts = require('typescript');

const normalisePath = (path: string) => path.replace(/\\/g, '/');

function getRelativePath(filename: string, targetFile: string) {
  const relPath = relative(dirname(filename), targetFile);
  if (relPath.startsWith('.')) return relPath;
  return `./${relPath}`;
}

export async function run({
  sourceDir,
  destDir,
  destEntriesToClean,
  copyFiles = [],
  pathRewriteRules = [],
  importRewriteRules = [],
  injectImports = [],
  sourceFilter,
  preCompileHooks = [],
}: {
  sourceDir: string;
  destDir: string;
  destEntriesToClean?: string[];
  copyFiles?: { from: string; to: string }[];
  pathRewriteRules?: { match: RegExp; replace: string }[];
  importRewriteRules?: {
    match: RegExp;
    replace: string | ((match: string) => string);
  }[];
  injectImports?: { imports: string[]; from: string }[];
  sourceFilter?: (path: string) => boolean;
  preCompileHooks?: (() => Promise<void>)[];
}) {
  const destClean = new Set(destEntriesToClean);
  try {
    for await (const entry of Deno.readDir(destDir)) {
      if (!destEntriesToClean || destClean.has(entry.name)) {
        await Deno.remove(join(destDir, entry.name), { recursive: true });
      }
    }
  } catch {
    // doing nothing, just skip
  }

  const sourceFilePathMap = new Map<string, string>();

  for await (const entry of walk(sourceDir, { includeDirs: false })) {
    const sourcePath = normalisePath(entry.path);
    if (entry.path.includes('syntax')) {
      console.log(`skipping ${entry.path}`);
      continue;
    }

    if (!sourceFilter || sourceFilter(sourcePath)) {
      sourceFilePathMap.set(sourcePath, resolveDestPath(sourcePath));
    }
  }

  for await (const [sourcePath, destPath] of sourceFilePathMap) {
    await compileFileForDeno(sourcePath, destPath);
  }

  for await (const fileToCopy of copyFiles) {
    await Deno.copyFile(fileToCopy.from, fileToCopy.to);
  }

  for await (const hook of preCompileHooks) {
    await hook();
  }

  async function compileFileForDeno(sourcePath: string, destPath: string) {
    const file = await Deno.readTextFile(sourcePath);
    await ensureDir(dirname(destPath));

    if (destPath.endsWith('.deno.ts')) {
      return await Deno.writeTextFile(destPath, file);
    }

    if (destPath.endsWith('.node.ts')) {
      return;
    }

    const parsedSource = ts.createSourceFile(
      basename(sourcePath),
      file,
      ts.ScriptTarget.Latest,
      false,
      ts.ScriptKind.TS,
    );

    const rewrittenFile: string[] = [];
    let cursor = 0;
    let isFirstNode = true;
    // deno-lint-ignore no-explicit-any
    parsedSource.forEachChild((node: any) => {
      if (isFirstNode) {
        isFirstNode = false;

        const neededImports = injectImports.reduce(
          (neededImports, { imports, from }) => {
            const usedImports = imports.filter((importName) =>
              parsedSource.identifiers?.has(importName)
            );
            if (usedImports.length) {
              neededImports.push({
                imports: usedImports,
                from,
              });
            }
            return neededImports;
          },
          [] as { imports: string[]; from: string }[],
        );

        if (neededImports.length) {
          const importDecls = neededImports.map((neededImport) => {
            const imports = neededImport.imports.join(', ');
            const importPath = resolveImportPath(
              sourcePath,
              relative(dirname(sourcePath), neededImport.from),
              sourcePath,
            );

            return `import {${imports}} from "${importPath}";`;
          });

          const importDecl = importDecls.join('\n') + '\n\n';

          const injectPos = node.getLeadingTriviaWidth?.(parsedSource) ??
            node.pos;
          rewrittenFile.push(file.slice(cursor, injectPos));
          rewrittenFile.push(importDecl);
          cursor = injectPos;
        }
      }

      if (
        (node.kind === ts.SyntaxKind.ImportDeclaration ||
          node.kind === ts.SyntaxKind.ExportDeclaration) &&
        node.moduleSpecifier
      ) {
        const pos = node.moduleSpecifier.pos + 2;
        const end = node.moduleSpecifier.end - 1;

        rewrittenFile.push(file.slice(cursor, pos));
        cursor = end;

        const importPath = file.slice(pos, end);

        let resolvedImportPath = resolveImportPath(
          sourcePath,
          importPath,
          sourcePath,
        );

        if (resolvedImportPath.endsWith('/adapter.node.ts')) {
          resolvedImportPath = resolvedImportPath.replace(
            '/adapter.node.ts',
            '/adapter.deno.ts',
          );
        }

        rewrittenFile.push(resolvedImportPath);
      }
    });
    rewrittenFile.push(file.slice(cursor));

    await Deno.writeTextFile(destPath, rewrittenFile.join(''));
  }

  function resolveDestPath(sourcePath: string) {
    let destPath = sourcePath;
    for (const rule of pathRewriteRules) {
      destPath = destPath.replace(rule.match, rule.replace);
    }
    return join(destDir, destPath);
  }

  function resolveImportPath(
    filename: string,
    importPath: string,
    sourcePath: string,
  ) {
    // First check importRewriteRules
    for (const rule of importRewriteRules) {
      if (rule.match.test(importPath)) {
        const repl = getRelativePath(
          filename,
          join(sourceDir, rule.replace as string),
        );
        return importPath.replace(rule.match, repl);
      }
    }

    // then resolve normally
    let resolvedPath = join(dirname(sourcePath), importPath);
    if (!sourceFilePathMap.has(resolvedPath)) {
      // If importPath doesn't exist, first try appending '.ts'
      resolvedPath = join(dirname(sourcePath), importPath + '.ts');

      if (!sourceFilePathMap.has(resolvedPath)) {
        // If that path doesn't exist, next try appending '/index.ts'
        resolvedPath = join(dirname(sourcePath), importPath + '/index.ts');

        if (!sourceFilePathMap.has(resolvedPath)) {
          throw new Error(
            `Cannot find imported file '${importPath}' in '${sourcePath}'`,
          );
        }
      }
    }

    const relImportPath = relative(
      dirname(sourceFilePathMap.get(sourcePath)!),
      sourceFilePathMap.get(resolvedPath)!,
    );
    return relImportPath.startsWith('../')
      ? relImportPath
      : './' + relImportPath;
  }
}
