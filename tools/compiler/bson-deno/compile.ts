import { run } from '../common/mod.ts';

run({
  sourceDir: './upstream/js-bson/src',
  destDir: './build/bson-deno',
  destEntriesToClean: ['_src', 'mod.ts'],
  pathRewriteRules: [
    { match: /^src\/index.node.ts$/, replace: 'mod.ts' },
    { match: /^upstream\/js-bson\/src\//, replace: '_src/' },
  ],
  injectImports: [
    {
      imports: ['process'],
      from: 'upstream/js-bson/src/globals.deno.ts',
    },
  ],
  importRewriteRules: [
    {
      match: /^buffer$/,
      replace: '../buffer.deno.ts',
    },
  ],
});

/* const denoTestFiles = new Set([
  "test/testbase.ts",
  "test/client.test.ts",
  "test/credentials.test.ts",
]); */

/* run({
  sourceDir: './js-bson/test/node',
  destDir: './bson-deno/test',
  //sourceFilter: path => {
  //  return denoTestFiles.has(path);
  //},
  pathRewriteRules: [{ match: /^test\//, replace: '' }],
  importRewriteRules: [
    //{
    //  match: /^\.\.\/src\/index.node$/,
    //  replace: "../../edgedb-deno/mod.ts",
    //},
    //{
    //  match: /^globals.deno.ts$/,
    //  replace: "../globals.deno.ts",
    //},
    //{
    //  match: /^\.\.\/src\/.+/,
    //  replace: match =>
    //    `${match.replace(/^\.\.\/src\//, "../../edgedb-deno/_src/")}${
    //      match.endsWith(".ts") ? "" : ".ts"
    //    }`,
    //},
    {
      match: /^buffer$/,
      replace: '../buffer.deno.ts',
    },
  ],
  injectImports: [
    //{
    //  imports: ["process"],
    //  from: "src/globals1.deno.ts",
    //},
    {
      imports: ['describe', 'expect', 'it'],
      from: 'js-bson/test/node/globals.deno.ts',
    },
  ],
}); */
