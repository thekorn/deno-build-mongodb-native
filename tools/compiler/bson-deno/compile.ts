import { run } from '../common/mod.ts';
import { removeProcessDeclarationParserUtils } from './hotfixes.ts';
import { checkMissingTestCases } from './checker.ts';

run({
  sourceDir: './upstream/js-bson/src',
  destDir: './build/bson-deno',
  destEntriesToClean: ['_src', 'mod.ts'],
  copyFiles: [
    {
      from: './assets/js-bson/mod.ts',
      to: './build/bson-deno/mod.ts',
    },
  ],
  pathRewriteRules: [
    { match: /^upstream\/js-bson\/src\//, replace: '_src/' },
  ],
  importRewriteRules: [
    {
      match: /^buffer$/,
      replace: './buffer.deno.ts',
    },
  ],
  injectImports: [
    {
      imports: ['process'],
      from: './upstream/js-bson/src/globals.deno.ts',
    },
  ],
  postCompileHooks: [
    removeProcessDeclarationParserUtils,
    checkMissingTestCases,
  ],
});
