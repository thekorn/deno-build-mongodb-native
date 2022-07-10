import { run } from '../common/mod.ts';

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
