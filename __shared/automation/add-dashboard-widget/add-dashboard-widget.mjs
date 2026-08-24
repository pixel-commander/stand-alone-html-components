import { readFile, writeFile, readdir, mkdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..', '..');
const PROJECTS = join(ROOT, 'projects');

const DASHBOARDS = 'libs/machine-insights/feature/dashboards';
const MODELS_ONLY = 'core';

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

const toComponent = (class_name, source) => {
  const props = readProps(source);

  const body = source
    .replace(/^const\s+\w+\s*=\s*\(/m, 'export const ' + class_name + ' = (')
    .replace(/^\};?\s*$/m, '};');

  const lines = [];
  lines.push("import type { ComponentProps } from 'react';");
  lines.push('');
  lines.push("import { cn } from '@md/cds/react/shadcn-shared/utils';");
  lines.push('');
  lines.push('export interface ' + class_name + "Props extends ComponentProps<'div'> {");
  props.forEach((one) => lines.push('  ' + one.name + '?: ' + typeFor(one.held) + ';'));
  lines.push('}');
  lines.push('');
  lines.push(body.trimEnd());
  lines.push('');

  return lines.join('\n');
};

const toSpec = (name, class_name, demo) => {
  const found = /^const\s+([A-Z_][A-Z0-9_]*)\s*=\s*(\[[\s\S]*?\]);/m.exec(demo);
  const rows = found ? found[2] : '[]';
  const held = found ? found[1] : 'ROWS';

  const lines = [];
  lines.push("import { render } from '@testing-library/react';");
  lines.push('');
  lines.push("import { " + class_name + " } from './" + name + "';");
  lines.push('');
  lines.push('const ' + held + ' = ' + rows + ';');
  lines.push('');
  lines.push("describe('" + class_name + "', () => {");
  lines.push("  it('renders', () => {");
  lines.push('    const { baseElement } = render(<' + class_name + ' data={' + held + '} />);');
  lines.push('');
  lines.push('    expect(baseElement).toBeTruthy();');
  lines.push('  });');
  lines.push('');
  lines.push("  it('renders with nothing', () => {");
  lines.push('    const { baseElement } = render(<' + class_name + ' data={[]} />);');
  lines.push('');
  lines.push('    expect(baseElement).toBeTruthy();');
  lines.push('  });');
  lines.push('});');
  lines.push('');

  return lines.join('\n');
};

const run = async () => {
  const component_name = process.argv[2];
  const lib_name = process.argv[3];
  const repo = process.argv[4];

  if (!component_name || !lib_name || !repo) {
    console.error('add-dashboard-widget — give it a name, a lib, and a repo');
    console.error('  node add-dashboard-widget.mjs <component-name> <lib> <path-to-repo>');
    process.exit(1);
  }

  if (lib_name === MODELS_ONLY) {
    console.error('add-dashboard-widget — ' + MODELS_ONLY + ' holds models and stores only');
    console.error('  it has no components folder and is not given one. pick another lib');
    process.exit(1);
  }

  const project = join(PROJECTS, component_name);
  const source_file = join(project, component_name + '.jsx');

  if (!(await exists(source_file))) {
    console.error('add-dashboard-widget — no component at projects/' + component_name + '/' + component_name + '.jsx');
    process.exit(1);
  }

  const lib = join(repo, DASHBOARDS, lib_name);

  if (!(await exists(lib))) {
    const held = (await exists(join(repo, DASHBOARDS)))
      ? (await readdir(join(repo, DASHBOARDS), { withFileTypes: true }))
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
      : [];

    console.error('add-dashboard-widget — no lib at ' + DASHBOARDS + '/' + lib_name);
    if (held.length) {
      console.error('  the libs there are:');
      held.forEach((name) => console.error('    ' + name));
    }
    process.exit(1);
  }

  const into = join(lib, 'src', 'lib', 'components');
  const written = join(into, component_name + '.tsx');

  if (await exists(written)) {
    console.error('add-dashboard-widget — ' + lib_name + ' already has ' + component_name + '.tsx');
    console.error('  nothing was written. a name already written is the name that stays');
    process.exit(1);
  }

  const class_name = toPascalCase(component_name);
  const source = await readFile(source_file, 'utf8');

  const demo_file = join(project, 'script.js');
  const demo = (await exists(demo_file)) ? await readFile(demo_file, 'utf8') : '';

  await mkdir(into, { recursive: true });
  await writeFile(written, toComponent(class_name, source));
  await writeFile(join(into, component_name + '.spec.tsx'), toSpec(component_name, class_name, demo));

  console.log('add-dashboard-widget — ' + component_name);
  console.log('');
  console.log('  read       projects/' + component_name);
  console.log('  written    ' + DASHBOARDS + '/' + lib_name + '/src/lib/components');
  console.log('    ' + component_name + '.tsx');
  console.log('    ' + component_name + '.spec.tsx');
  console.log('  named      ' + class_name + ', with no prefix');
  console.log('');
  console.log('  no generator ran and nothing was wired. a dashboard component is a file');
  console.log('  in a lib that already exists, and it inherits that lib rather than');
  console.log('  carrying a project, an alias, or tags of its own');
  console.log('');
  console.log('  still yours to do:');
  console.log('    the prop types, which were read from what the defaults were set to.');
  console.log('    the component stays internal unless the lib index exports it, and an');
  console.log('    export wants a reason written beside it');
};

run().catch((error) => {
  console.error('add-dashboard-widget — stopped');
  console.error('  ' + error.message);
  process.exit(1);
});
