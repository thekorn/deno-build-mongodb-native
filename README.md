# Build mongodb-native client for deno

This repository includes all tooling and required changes to build the `mongodb-native` client for deno.

## TODOS

- [ ] port js-bson for deno
  - [ ] fix type exports in `src/bson.ts`
        In order to fix this issue upstream a ticket and [PR](https://github.com/mongodb/js-bson/pull/507) has been created. As a workaround a firk with this feature applied is used as a baseline
  - [ ] implement a basic set of tests for `bson-deno`
  - [ ] potentially even consider porting all upstream tests
- [ ] port node-mongodb-native for deno
- [ ] implement bson-ext in rust / wasm
