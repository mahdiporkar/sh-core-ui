#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
const [command, ...files] = process.argv.slice(2);
const read = async (file) => JSON.parse(await readFile(file, 'utf8'));
const schemaFor = async (manifest) =>
  read(
    manifest.decisions
      ? 'src/manifest/schemas/effective-manifest.schema.json'
      : 'src/manifest/schemas/definition-manifest.schema.json',
  );
const lint = (manifest) => {
  const errors = [];
  const keys = new Set();
  for (const resource of manifest.resources) {
    if (keys.has(resource.key)) errors.push(`duplicate resource: ${resource.key}`);
    keys.add(resource.key);
    const actions = new Set();
    for (const action of resource.actions) {
      if (actions.has(action.key)) errors.push(`duplicate action: ${resource.key}/${action.key}`);
      actions.add(action.key);
    }
  }
  for (const resource of manifest.resources)
    if (resource.parent && !keys.has(resource.parent))
      errors.push(`invalid parent: ${resource.parent}`);
  return errors;
};
if (command === 'validate') {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const validators = new Map();
  for (const file of files) {
    const manifest = await read(file);
    const kind = manifest.decisions ? 'effective' : 'definition';
    let validate = validators.get(kind);
    if (!validate) {
      validate = ajv.compile(await schemaFor(manifest));
      validators.set(kind, validate);
    }
    if (!validate(manifest)) {
      console.error(file, validate.errors);
      process.exitCode = 1;
    } else console.log(`valid: ${file}`);
  }
} else if (command === 'lint') {
  for (const file of files) {
    const errors = lint(await read(file));
    if (errors.length) {
      console.error(file, errors);
      process.exitCode = 1;
    } else console.log(`clean: ${file}`);
  }
} else if (command === 'generate') {
  const [input, output] = files;
  if (!input || !output) throw new Error('generate requires input and output');
  const manifest = await read(input);
  const resources = manifest.resources
    .map(({ key }) => `  ${JSON.stringify(key)}: ${JSON.stringify(key)},`)
    .join('\n');
  const actions = manifest.resources
    .flatMap((resource) =>
      resource.actions.map(
        ({ key }) => `  ${JSON.stringify(`${resource.key}.${key}`)}: ${JSON.stringify(key)},`,
      ),
    )
    .join('\n');
  await writeFile(
    output,
    `export const resources = {\n${resources}\n} as const;\nexport const actions = {\n${actions}\n} as const;\n`,
  );
} else {
  console.error('Usage: manifest-cli <validate|lint|generate> ...files');
  process.exitCode = 1;
}
