import { desc, run, sh, task } from 'https://deno.land/x/drake@v1.5.2/mod.ts';

desc('clean build');
task('clean-build', [], async function () {
  await sh('mkdir -p build');
  await sh('rm -rf build/bson-deno');
});

desc('Clone the bson-deno repository');
task('clone-bson-deno', ['clean-build'], async function () {
  await sh('git clone git@github.com:thekorn/bson-deno.git build/bson-deno');
});

desc('Build bson-deno');
task('build-bson-deno', [], async function () {
  await sh([
    'cp assets/js-bson/src/buffer.deno.ts upstream/js-bson/src/',
    'cp assets/js-bson/src/globals.deno.ts upstream/js-bson/src/',
  ]);
  await sh('deno run --unstable -A  tools/compiler/bson-deno/compile.ts');
  //await sh('cp assets/js-bson/mod.ts build/bson-deno');
  await sh('deno fmt', { cwd: 'build/bson-deno' });
  await sh('deno check mod.ts', { cwd: 'build/bson-deno' });
  await sh('deno test', { cwd: 'build/bson-deno' });
});

run();
