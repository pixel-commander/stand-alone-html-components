import { readFile, writeFile, readdir, rm, stat, rename } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const RUN = promisify(execFile);

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..', '..');
const SHIPPED = join(ROOT, 'shipped');

const GENERATOR = '@md/jbtmarel-plugin:cds-react-ui-lib';
const LIBS = 'libs/cds/react/ui';

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

async function unpack(archive, into) {
  await RUN('powershell', [
    '-NoProfile',
    '-Command',
    'Expand-Archive -Path "' + archive + '" -DestinationPath "' + into + '" -Force',
  ]);
}

async function prefixComponent(path, class_name, prefixed) {
  const body = await readFile(path, 'utf8');
  await writeFile(path, body.split(class_name).join(prefixed));
}

async function prefixStory(path, class_name, prefixed) {
  const body = await readFile(path, 'utf8');
  const swapped = body.split(class_name).join(prefixed);
  await writeFile(path, swapped.split("title: '" + prefixed + "'").join("title: '" + class_name + "'"));
}

async function run() {
  const component_name = process.argv[2];
  const repo = process.argv[3];

  if (!component_name || !repo) {
    console.error('install-new-component — give it a name and a repo');
    console.error('  node install-new-component.mjs <component-name> <path-to-mc-applications>');
    process.exit(1);
  }

  const archive = join(SHIPPED, component_name, component_name + '.zip');

  if (!(await exists(archive))) {
    console.error('install-new-component — no package at shipped/' + component_name + '/' + component_name + '.zip');
    console.error('  ship the project first');
    process.exit(1);
  }

  if (!(await exists(join(repo, 'nx.json')))) {
    console.error('install-new-component — ' + repo + ' is not an nx workspace');
    console.error('  no nx.json there');
    process.exit(1);
  }

  const lib = join(repo, LIBS, component_name);

  if (await exists(lib)) {
    console.error('install-new-component — ' + LIBS + '/' + component_name + ' already exists');
    console.error('  nothing was written. a name already written is the name that stays');
    process.exit(1);
  }

  const class_name = toPascalCase(component_name);
  const prefixed = 'Cds' + class_name;

  console.log('install-new-component — ' + component_name);
  console.log('');
  console.log('  generating the library, which takes a moment');

  const command = ['npx', 'nx', 'g', GENERATOR, component_name, '--shadcn=true', '--no-interactive'];

  await RUN(
    process.platform === 'win32' ? 'cmd.exe' : command[0],
    process.platform === 'win32' ? ['/c', ...command] : command.slice(1),
    { cwd: repo, maxBuffer: 1024 * 1024 * 32 },
  );

  const into = join(lib, 'src', 'lib');
  await unpack(archive, into);

  const readme = join(into, 'README.txt');
  if (await exists(readme)) await rename(readme, join(lib, 'README.txt'));

  const losses = join(into, 'LOSSES.txt');
  if (await exists(losses)) await rm(losses);

  await prefixComponent(join(into, component_name + '.tsx'), class_name, prefixed);
  await prefixStory(join(into, component_name + '.stories.tsx'), class_name, prefixed);

  const placed = (await readdir(into, { withFileTypes: true }))
    .map((entry) => (entry.isDirectory() ? entry.name + '/' : entry.name));

  console.log('  unpacked   ' + LIBS + '/' + component_name + '/src/lib');
  placed.forEach((name) => console.log('    ' + name));
  console.log('  renamed    ' + class_name + ' to ' + prefixed + ', the story title left flat');
  console.log('  README     moved beside the library');
  console.log('');
  console.log('  the generator wired the path, the project, and the storybook host.');
  console.log('  import it as @md/cds/react/ui/' + component_name);
  console.log('');
  console.log('  still yours to do:');
  console.log('    the expressions between the tags, and the story values —');
  console.log('    the demo the component was modelled on did not ship');
}

run().catch((error) => {
  console.error('install-new-component — stopped');
  console.error('  ' + (error.stderr || error.message));
  process.exit(1);
});
