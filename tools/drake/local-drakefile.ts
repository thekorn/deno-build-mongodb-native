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

run();
