# Build mongodb-native client for deno

This repository includes all tooling and required changes to build the `mongodb-native` client for deno.

## TODOS

- [ ] port js-bson for deno
  - [ ] fix type exports in `src/bson.ts`
  - [ ] implement a basic set of tests for `bson-deno`
  - [ ] potentially even consider porting all upstream tests
- [ ] port node-mongodb-native for deno
- [ ] implement bson-ext in rust / wasm
