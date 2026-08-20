import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..', '..');
const TEMPLATE = join(ROOT, '__shared', '__template');
const PROJECTS = join(ROOT, 'projects');
const SHELL = join(ROOT, 'index.html');

const PLACEHOLDER_TAG = 'component-name';
const PLACEHOLDER_CLASS = 'ComponentName';
const PLACEHOLDER_FILE = 'component.js';
const PLACEHOLDER_TITLE = '<title>component</title>';

function toPascalCase(name) {
  return name.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');
}

function isValidName(name) {
  return /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name);
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function copyTemplate(source, destination, tag_name) {
  await mkdir(destination, { recursive: true });
  const entries = await readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const from = join(source, entry.name);

    if (entry.isDirectory()) {
      await copyTemplate(from, join(destination, entry.name), tag_name);
      continue;
    }

    if (entry.name === 'README.txt') continue;

    const renamed = entry.name === PLACEHOLDER_FILE ? tag_name + '.js' : entry.name;
    const to = join(destination, renamed);
    const body = await readFile(from, 'utf8');
    await writeFile(to, fill(body, tag_name));
  }
}

function fill(body, tag_name) {
  return body
    .split(PLACEHOLDER_TITLE).join('<title>' + tag_name + '</title>')
    .split(PLACEHOLDER_FILE).join(tag_name + '.js')
    .split(PLACEHOLDER_CLASS).join(toPascalCase(tag_name))
    .split(PLACEHOLDER_TAG).join(tag_name);
}

async function addToShell(tag_name) {
  const shell = await readFile(SHELL, 'utf8');
  const entry = "  { name: '" + tag_name + "', path: 'projects/" + tag_name + "/index.html' },";

  if (shell.includes("name: '" + tag_name + "'")) return false;

  const anchor = shell.indexOf('];', shell.indexOf('const PROJECTS = ['));
  if (anchor === -1) throw new Error('could not find the PROJECTS array in the shell');

  const updated = shell.slice(0, anchor) + entry + '\r\n' + shell.slice(anchor);
  await writeFile(SHELL, updated);
  return true;
}

async function run() {
  const tag_name = process.argv[2];

  if (!tag_name) {
    console.error('add-new-project — give it a name');
    console.error('  node add-new-project.mjs <component-name>');
    process.exit(1);
  }

  if (!isValidName(tag_name)) {
    console.error('add-new-project — "' + tag_name + '" is not a usable name');
    console.error('  names are lower case and dash-separated, and a custom element needs a dash');
    process.exit(1);
  }

  if (!tag_name.includes('-')) {
    console.error('add-new-project — "' + tag_name + '" has no dash');
    console.error('  a custom element tag must contain a dash, so the browser accepts it');
    process.exit(1);
  }

  const destination = join(PROJECTS, tag_name);

  if (await exists(destination)) {
    console.error('add-new-project — projects/' + tag_name + ' already exists');
    console.error('  nothing was written. Rule 9: a name already written is the name that stays');
    process.exit(1);
  }

  await copyTemplate(TEMPLATE, destination, tag_name);
  const listed = await addToShell(tag_name);

  console.log('add-new-project — ' + tag_name);
  console.log('');
  console.log('  copied     projects/' + tag_name);
  console.log('  renamed    ' + tag_name + '.js');
  console.log('  filled     tag, class, and title');
  console.log(listed ? '  listed     added to the shell' : '  listed     already in the shell, left alone');
  console.log('');
  console.log('  still yours to do:');
  console.log('    the markup, the props, the position classes, the stylesheets,');
  console.log('    the demo in script.js, and the project README');
  console.log('');
  console.log('  the stamp in the template README is the full list');
}

run().catch((error) => {
  console.error('add-new-project — stopped');
  console.error('  ' + error.message);
  process.exit(1);
});
