# Build mongodb-native client for deno

This repository includes all tooling and required changes to build the `mongodb-native` client for deno.

## TODOS

- [ ] port js-bson for deno
  - [x] fix type exports in `src/bson.ts`
        In order to fix this issue upstream a ticket and [PR](https://github.com/mongodb/js-bson/pull/507) has been created. As a workaround a firk with this feature applied is used as a baseline
  - [ ] implement a basic set of tests for `bson-deno`
  - [ ] potentially even consider porting all upstream tests
- [ ] port node-mongodb-native for deno
- [ ] implement bson-ext in rust / wasm

## Thanks

- the inspiration for this project came from this [blogpost from edgeDB](https://www.edgedb.com/blog/how-we-converted-our-node-js-library-to-deno-using-deno) - early version of the compiler is also based on their work
