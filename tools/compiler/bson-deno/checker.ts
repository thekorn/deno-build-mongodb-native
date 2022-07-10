import { walk } from 'https://deno.land/std@0.114.0/fs/mod.ts';

// compare the upstream tests with the ones implemented in `bson-deno` to see which are missing
export async function checkMissingTestCases() {
  console.log('checking `js-bson` for missing testcases');
  const bsonDenoTestSuites: Set<string> = new Set();
  for await (
    const entry of walk('./build/bson-deno/test', {
      includeDirs: false,
      maxDepth: 1,
    })
  ) {
    const filename = entry.name.replace('.ts', '.js');
    bsonDenoTestSuites.add(filename);
    bsonDenoTestSuites.add(filename.replace('test.js', 'tests.js'));
  }

  const foundTestSuites: Set<string> = new Set();
  const missingTestSuites: Set<string> = new Set();

  for await (
    const entry of walk('./upstream/js-bson/test/node', {
      includeDirs: false,
      maxDepth: 1,
    })
  ) {
    if (bsonDenoTestSuites.has(entry.name)) {
      foundTestSuites.add(entry.name);
    } else {
      missingTestSuites.add(entry.name.replace('.js', ''));
    }
  }
  console.info(
    `Found ${foundTestSuites.size}/${
      foundTestSuites.size + missingTestSuites.size
    } test suites`,
  );
  if (missingTestSuites.size > 0) {
    console.warn(
      '%cThose tests suites are missing in bson-deno:',
      'color: yellow',
      missingTestSuites,
    );
  }
}
