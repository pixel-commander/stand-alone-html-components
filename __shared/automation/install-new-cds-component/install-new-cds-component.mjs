import { readFile, writeFile, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const RUN = promisify(execFile);

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..', '..');
const PROJECTS = join(ROOT, 'projects');
const TEMPLATES = join(ROOT, '__shared', '__templates', 'react-component');

const GENERATOR = '@md/jbtmarel-plugin:cds-react-ui-lib';
const LIBS = 'libs/cds/react/ui';

const toPascalCase = (name) => name.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');

const exists = async (path) => {
  try {
    await stat(path);

    return true;
  } catch {
    return false;
  }
};

const readProps = (source) => {
  const found = /=\s*\(\{([\s\S]*?)\}\s*(?::[^)]*)?\)\s*=>/.exec(source);
  if (!found) return [];

  return found[1]
    .split(',')
    .map((one) => one.trim())
    .filter(Boolean)
    .map((one) => {
      const at = one.indexOf('=');
      const name = (at === -1 ? one : one.slice(0, at)).trim();
      const held = at === -1 ? '' : one.slice(at + 1).trim();

      return { name, held };
    })
    .filter((one) => one.name && one.name !== 'className');
};

const typeFor = (held) => {
  if (held.startsWith('[')) return 'Record<string, unknown>[]';
  if (held.startsWith("'") || held.startsWith('"')) return 'string';
  if (held === 'true' || held === 'false') return 'boolean';
  if (held === 'null') return '((...args: never[]) => void) | null';
  if (/^-?\d/.test(held)) return 'number';

  return 'unknown';
};

const toComponent = (name, class_name, source) => {
  const prefixed = 'Cds' + class_name;
  const props = readProps(source);

  const body = source
    .replace(/^const\s+\w+\s*=\s*\(/m, 'export const ' + prefixed + ' = (')
    .replace(/^\};?\s*$/m, '};');

  const lines = [];
  lines.push("import * as React from 'react';");
  lines.push('');
  lines.push("import { cn } from '@md/cds/react/shadcn-shared/utils';");
  lines.push('');
  lines.push('export type ' + prefixed + 'Props = React.ComponentProps<\'div\'> & {');
  props.forEach((one) => lines.push('  ' + one.name + '?: ' + typeFor(one.held) + ';'));
  lines.push('};');
  lines.push('');
  lines.push(body.trimEnd());
  lines.push('');
  lines.push('export default ' + prefixed + ';');
  lines.push('');

  return lines.join('\n');
};

const toStory = (name, class_name, demo) => {
  const prefixed = 'Cds' + class_name;
  const found = /^const\s+([A-Z_][A-Z0-9_]*)\s*=\s*(\[[\s\S]*?\]);/m.exec(demo);
  const rows = found ? found[2] : '[]';
  const held = found ? found[1] : 'ROWS';

  const lines = [];
  lines.push("import type { Meta, StoryObj } from '@storybook/react-vite';");
  lines.push('');
  lines.push("import { " + prefixed + " } from './" + name + "';");
  lines.push('');
  lines.push('const ' + held + ' = ' + rows + ';');
  lines.push('');
  lines.push('const meta: Meta<typeof ' + prefixed + '> = {');
  lines.push('  component: ' + prefixed + ',');
  lines.push("  title: '" + class_name + "',");
  lines.push('  args: {');
  lines.push('    data: ' + held + ',');
  lines.push('  },');
  lines.push('};');
  lines.push('');
  lines.push('export default meta;');
  lines.push('type Story = StoryObj<typeof ' + prefixed + '>;');
  lines.push('');
  lines.push('export const Default: Story = {};');
  lines.push('');
  lines.push('export const NoData: Story = {');
  lines.push('  args: {');
  lines.push('    data: [],');
  lines.push('  },');
  lines.push('};');
  lines.push('');

  return lines.join('\n');
};

const run = async () => {
  const component_name = process.argv[2];
  const repo = process.argv[3];

  if (!component_name || !repo) {
    console.error('install-new-cds-component — give it a name and a repo');
    console.error('  node install-new-cds-component.mjs <component-name> <path-to-repo>');
    process.exit(1);
  }

  const project = join(PROJECTS, component_name);
  const source_file = join(project, component_name + '.jsx');

  if (!(await exists(source_file))) {
    console.error('install-new-cds-component — no component at projects/' + component_name + '/' + component_name + '.jsx');
    process.exit(1);
  }

  if (!(await exists(join(repo, 'nx.json')))) {
    console.error('install-new-cds-component — ' + repo + ' is not an nx workspace');
    console.error('  no nx.json there');
    process.exit(1);
  }

  const lib = join(repo, LIBS, component_name);

  if (await exists(lib)) {
    console.error('install-new-cds-component — ' + LIBS + '/' + component_name + ' already exists');
    console.error('  nothing was written. a name already written is the name that stays');
    process.exit(1);
  }

  const class_name = toPascalCase(component_name);
  const prefixed = 'Cds' + class_name;
  const source = await readFile(source_file, 'utf8');

  const demo_file = join(project, 'script.js');
  const demo = (await exists(demo_file)) ? await readFile(demo_file, 'utf8') : '';

  console.log('install-new-cds-component — ' + component_name);
  console.log('');
  console.log('  generating the library, which takes a moment');

  const command = ['npx', 'nx', 'g', GENERATOR, component_name, '--shadcn=true', '--no-interactive'];

  await RUN(
    process.platform === 'win32' ? 'cmd.exe' : command[0],
    process.platform === 'win32' ? ['/c', ...command] : command.slice(1),
    { cwd: repo, maxBuffer: 1024 * 1024 * 32 },
  );

  const into = join(lib, 'src', 'lib');

  await writeFile(join(into, component_name + '.tsx'), toComponent(component_name, class_name, source));
  await writeFile(join(into, component_name + '.stories.tsx'), toStory(component_name, class_name, demo));

  const readme = join(project, 'README.txt');
  if (await exists(readme)) await writeFile(join(lib, 'README.txt'), await readFile(readme, 'utf8'));

  console.log('  read       projects/' + component_name);
  console.log('  written    ' + LIBS + '/' + component_name + '/src/lib');
  console.log('    ' + component_name + '.tsx');
  console.log('    ' + component_name + '.stories.tsx');
  console.log('  named      ' + class_name + ' became ' + prefixed + ', the story title left flat');
  console.log('');
  console.log('  the generator wired the path, the project, and the storybook host.');
  console.log('  import it as @md/cds/react/ui/' + component_name);
  console.log('');
  console.log('  still yours to do:');
  console.log('    the prop types, which were read from what the defaults were set to,');
  console.log('    and anything the utilities could not carry across');
};

run().catch((error) => {
  console.error('install-new-cds-component — stopped');
  console.error('  ' + (error.stderr || error.message));
  process.exit(1);
});
