// remove a redundant type declaration for `process` from src/parser/utils.ts
export async function removeProcessDeclarationParserUtils() {
  const content = await Deno.readTextFile(
    './build/bson-deno/_src/parser/utils.ts',
  );
  const newContent = content.replace(
    'declare let process: any;',
    '//declare let process: any;',
  );
  await Deno.writeTextFile(
    './build/bson-deno/_src/parser/utils.ts',
    newContent,
  );
}
