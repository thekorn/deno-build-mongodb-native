import { run } from '../common/mod.ts';
import { removeProcessDeclarationParserUtils } from './hotfixes.ts';
import { checkMissingTestCases } from './checker.ts';

run({
  sourceDir: './upstream/node-mongodb-native/src',
  destDir: './build/deno-mongodb-native',
  destEntriesToClean: ['_src', 'mod.ts'],
  copyFiles: [
    {
      from: './assets/node-mongodb-native/mod.ts',
      to: './build/bson-mongodb-native/mod.ts',
    },
  ],
  pathRewriteRules: [
    { match: /^upstream\/node-mongodb-native\/src\//, replace: '_src/' },
  ],
  importRewriteRules: [
    // {
    //   match: /^buffer$/,
    //   replace: './buffer.deno.ts',
    // },
  ],
  injectImports: [
    //{
    //  imports: ['process'],
    //  from: './upstream/js-bson/src/globals.deno.ts',
    //},
    {
      imports: ['stream'],
      from: './upstream/node-mongodb-native/src/globals.deno.ts',
    },
  ],
  postCompileHooks: [
    removeProcessDeclarationParserUtils,
    checkMissingTestCases,
  ],
});
