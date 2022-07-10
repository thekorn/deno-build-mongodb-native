# Build mongodb-native client for deno

This repository includes all tooling and required changes to build the `mongodb-native` client for deno.

## Howto port the deno libraries

### Prerequisite

Install `deno`, see [documentation](https://deno.land/manual/getting_started/installation)
The node `typescript` library is used to process upstream, run `npm install` in the root of the repository

### update upstream

upstream of `js-bson` is tracked as git submodule, use usual `git submodules` techniques to fetch and potentially update the upstream baseline, like

```
$ git submodule update --init --recursive --remote
```

### build bson-deno

First clone the current version of `bson-deno`:

```
$ deno run -A tools/drake/local-drakefile.ts clone-bson-deno
```

Then compile the new version of `bson-deno`:

```
$ deno run -A tools/drake/local-drakefile.ts build-bson-deno
```

## TODOS

- [ ] port js-bson for deno
  - [x] fix type exports in `src/bson.ts`
        In order to fix this issue upstream a ticket and [PR](https://github.com/mongodb/js-bson/pull/507) has been created. As a workaround a firk with this feature applied is used as a baseline
  - [x] implement a basic set of tests for `bson-deno`
  - [ ] potentially even consider porting all upstream tests
- [ ] port node-mongodb-native for deno
- [ ] implement bson-ext in rust / wasm (or not, as bson-ext is [reaching EOL](https://jira.mongodb.org/projects/NODE/issues/NODE-3654))

## Thanks

- the inspiration for this project came from this [blogpost from edgeDB](https://www.edgedb.com/blog/how-we-converted-our-node-js-library-to-deno-using-deno) - early version of the compiler is also based on their work
