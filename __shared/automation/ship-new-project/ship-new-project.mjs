import { readFile, writeFile, mkdir, readdir, rm, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const RUN = promisify(execFile);

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..', '..');
const PROJECTS = join(ROOT, 'projects');
const SHIPPED = join(ROOT, 'shipped');

const ASSET_PATTERN = /['"]([^'"]*\.(?:svg|png|jpg|jpeg|gif|webp|woff2?))['"]/g;
const COUNTING_PATTERN = /:(?:nth-child|nth-of-type|nth-last-child|first-child|last-child|only-child)\b/;
const TEMPLATE_PATTERN = /const\s+([A-Z_]+)\s*=\s*document\.createElement\('template'\);\s*\1\.innerHTML\s*=\s*`([\s\S]*?)`;/g;
const FIELD_PATTERN = /^\s{2}#([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([^;]+);\s*$/gm;
const BUILT_PATTERN = /document\.createElement\('(?!template')([a-z]+)'/g;

function toPascalCase(name) {
  return name.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

function readTemplates(source) {
  const templates = [];
  let match;
  TEMPLATE_PATTERN.lastIndex = 0;

  while ((match = TEMPLATE_PATTERN.exec(source)) !== null) {
    templates.push({ name: match[1], markup: match[2].trim() });
  }

  return templates;
}

function readFields(source) {
  const fields = [];
  let match;
  FIELD_PATTERN.lastIndex = 0;

  while ((match = FIELD_PATTERN.exec(source)) !== null) {
    fields.push({ name: match[1], initial: match[2].trim() });
  }

  return fields;
}

function typeFor(field) {
  if (field.initial === '[]') return 'Record<string, unknown>[]';
  if (field.initial === 'null') return '((...args: never[]) => void) | null';
  if (/^['"]/.test(field.initial)) return 'string';
  if (field.initial === 'false' || field.initial === 'true') return 'boolean';
  if (/^-?\d/.test(field.initial)) return 'number';
  return 'unknown';
}

function defaultFor(field) {
  if (field.initial === 'null') return 'undefined';
  return field.initial;
}

function toJsx(markup) {
  return markup
    .replace(/\bclass=/g, 'className=')
    .replace(/\bfor=/g, 'htmlFor=')
    .replace(/<(img|input|br|hr|meta|link)\b([^>]*?)\s*\/?>/g, '<$1$2 />')
    .split('\n')
    .map((line) => (line.trim() ? '      ' + line : line))
    .join('\n');
}

function buildComponent(project_name, source) {
  const class_name = toPascalCase(project_name);
  const templates = readTemplates(source);
  const fields = readFields(source);

  const props = ['  data?: Record<string, unknown>[];', '  className?: string;'];
  const signature = ['  data = [],', '  className,'];

  fields.forEach((field) => {
    if (field.name === 'data') return;
    props.push('  ' + field.name + '?: ' + typeFor(field) + ';');
    signature.push('  ' + field.name + ' = ' + defaultFor(field) + ',');
  });

  const root = templates.length ? toJsx(templates[0].markup) : '      <div />';

  const lines = [];
  lines.push("import './styles.css';");
  lines.push('');
  lines.push('export type ' + class_name + 'Props = {');
  lines.push(...props);
  lines.push('};');
  lines.push('');
  lines.push('export function ' + class_name + '({');
  lines.push(...signature);
  lines.push('}: ' + class_name + 'Props) {');
  lines.push('  return (');
  lines.push('    <>');
  lines.push(root);
  lines.push('    </>');
  lines.push('  );');
  lines.push('}');
  lines.push('');
  lines.push('export default ' + class_name + ';');
  lines.push('');

  return lines.join('\n');
}

function auditProject(project_name, source, css, templates) {
  const blockers = [];

  BUILT_PATTERN.lastIndex = 0;
  const built = source.match(BUILT_PATTERN);
  if (built) {
    blockers.push({
      what: 'markup built from createElement',
      detail: built.length + ' plain tag' + (built.length === 1 ? '' : 's') + ' the conversion cannot read as markup',
      fix: 'move the structure into a template and clone it. a custom element being mounted is not this — a tag with a dash in it upgrades when it is created, and putting one in a template leaves it inert',
    });
  }

  if (!templates.length) {
    blockers.push({
      what: 'no template found',
      detail: 'nothing to carry over as markup',
      fix: 'give the component a template holding its structure',
    });
  }

  if (COUNTING_PATTERN.test(css)) {
    const counted = css.split('\n')
      .map((line, index) => ({ line: line.trim(), number: index + 1 }))
      .filter((entry) => COUNTING_PATTERN.test(entry.line));

    blockers.push({
      what: 'stylesheet counts children',
      detail: counted.map((entry) => 'line ' + entry.number + ': ' + entry.line).join('\n              '),
      fix: 'decide the position where the elements are made and put it on them as a class',
    });
  }

  if (/this\.classList\.add\(/.test(source)) {
    blockers.push({
      what: 'the host element carries the class',
      detail: 'the custom element disappears in React, and the class goes with it',
      fix: 'put the class on a root element inside the template instead',
    });
  }

  const tag_rules = css.split('\n').filter((line) => new RegExp('^' + project_name + '\\b').test(line.trim()));
  if (tag_rules.length) {
    blockers.push({
      what: 'stylesheet targets the tag name',
      detail: tag_rules.length + ' rule' + (tag_rules.length === 1 ? '' : 's') + ' written against ' + project_name,
      fix: 'write them against .' + project_name + ' instead, which carries over unchanged',
    });
  }

  const decisions = [];
  let asset;
  ASSET_PATTERN.lastIndex = 0;
  while ((asset = ASSET_PATTERN.exec(source)) !== null) {
    decisions.push({
      what: 'asset path',
      detail: asset[1],
      fix: 'this was relative to the project folder and is relative to nothing once the component moves',
    });
  }

  return { blockers, decisions };
}

async function copyShipped(project_name, destination, component_source) {
  const project = join(PROJECTS, project_name);
  const carried = [];

  await writeFile(join(destination, project_name + '.tsx'), component_source);
  carried.push(project_name + '.tsx');

  const css = await readFile(join(project, 'css', 'project.css'), 'utf8');
  await writeFile(join(destination, 'styles.css'), css);
  carried.push('styles.css');

  const readme = join(project, 'README.txt');
  if (await exists(readme)) {
    await writeFile(join(destination, 'README.txt'), await readFile(readme, 'utf8'));
    carried.push('README.txt');
  }

  const icons = join(project, 'icons');
  if (await exists(icons)) {
    await mkdir(join(destination, 'icons'), { recursive: true });
    const entries = await readdir(icons);
    for (const entry of entries) {
      await writeFile(join(destination, 'icons', entry), await readFile(join(icons, entry)));
      carried.push('icons/' + entry);
    }
  }

  return carried;
}

async function zip(destination, project_name) {
  const archive = join(destination, project_name + '.zip');
  if (await exists(archive)) await rm(archive);

  await RUN('powershell', [
    '-NoProfile',
    '-Command',
    'Compress-Archive -Path "' + join(destination, '*') + '" -DestinationPath "' + archive + '" -Force',
  ]);

  return archive;
}

function report(title, entries) {
  if (!entries.length) return;
  console.log('  ' + title);
  entries.forEach((entry) => {
    console.log('    ' + entry.what + ' — ' + entry.detail);
    console.log('      ' + entry.fix);
  });
  console.log('');
}

async function run() {
  const project_name = process.argv[2];

  if (!project_name) {
    console.error('ship-new-project — give it a name');
    console.error('  node ship-new-project.mjs <project-name>');
    process.exit(1);
  }

  const project = join(PROJECTS, project_name);

  if (!(await exists(project))) {
    console.error('ship-new-project — projects/' + project_name + ' does not exist');
    process.exit(1);
  }

  const component_file = join(project, 'js', project_name + '.js');

  if (!(await exists(component_file))) {
    console.error('ship-new-project — no component file at js/' + project_name + '.js');
    console.error('  the component and the demo are separate files, and only the component ships');
    process.exit(1);
  }

  const source = await readFile(component_file, 'utf8');
  const css = await readFile(join(project, 'css', 'project.css'), 'utf8');
  const templates = readTemplates(source);
  const { blockers, decisions } = auditProject(project_name, source, css, templates);

  console.log('ship-new-project — ' + project_name);
  console.log('');

  if (blockers.length) {
    report('blocked', blockers);
    console.log('  nothing was written');
    console.log('');
    console.log('  these are the parts of the conversion a script cannot do for you.');
    console.log('  fix them in the project, then run this again');
    process.exit(1);
  }

  const destination = join(SHIPPED, project_name);
  await mkdir(destination, { recursive: true });

  const component_source = buildComponent(project_name, source);
  const carried = await copyShipped(project_name, destination, component_source);
  await zip(destination, project_name);

  console.log('  written    shipped/' + project_name);
  carried.forEach((name) => console.log('    ' + name));
  console.log('  zipped     ' + project_name + '.zip');
  console.log('');

  report('decisions left to you', decisions);

  console.log('  the markup carried over as it stood. what the script filled in');
  console.log('  is not filled in for you — the expressions between the tags are');
  console.log('  yours to write, and the demo is what to check them against');
}

run().catch((error) => {
  console.error('ship-new-project — stopped');
  console.error('  ' + error.message);
  process.exit(1);
});
