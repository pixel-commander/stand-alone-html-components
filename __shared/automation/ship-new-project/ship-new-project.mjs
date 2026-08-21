import { readFile, writeFile, mkdir, readdir, rm, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const RUN = promisify(execFile);
const REPORT = [];

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..', '..');
const PROJECTS = join(ROOT, 'projects');
const SHIPPED = join(ROOT, 'shipped');
const TEMPLATES = join(ROOT, '__shared', '__templates', 'react-component');

const ROW_ANCHOR = '  id?: string;';
const PROPS_ANCHOR = '  data?: ComponentNameRow[];';
const SIGNATURE_ANCHOR = '  data,';
const ARGS_ANCHOR = '    data: ROWS,';
const ROWS_ANCHOR = 'const ROWS = ';
const ITEM_OPEN = '        <div data-item key={index}>';
const ITEM_CLOSE = '        </div>';
const SHELL_OPEN = '    >';
const SHELL_CLOSE = '    </div>';

const LABEL_PATTERN = /data-label=["']([A-Za-z_][A-Za-z0-9_]*)["']/g;
const ITEM_TEMPLATE_PATTERN = /<[a-z]+[^>]*\bdata-item\b[^>]*>([\s\S]*?)<\/[a-z]+>\s*$/;

const ASSET_PATTERN = /['"]([^'"]*\.(?:svg|png|jpg|jpeg|gif|webp|woff2?))['"]/g;
const COUNTING_PATTERN = /:(?:nth-child|nth-of-type|nth-last-child|first-child|last-child|only-child)\b/;
const TEMPLATE_PATTERN = /const\s+([A-Z_]+)\s*=\s*document\.createElement\('template'\);\s*\1\.innerHTML\s*=\s*`([\s\S]*?)`;/g;
const FIELD_PATTERN = /^\s{2}#([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([^;]+);\s*$/gm;
const BUILT_PATTERN = /document\.createElement\('(?!template')([a-z]+)'/g;
const HEX_PATTERN = /#[0-9a-fA-F]{3,8}\b|\brgba?\(/;
const TAG_RULE_PATTERN = /^[a-z][a-z0-9]*(-[a-z0-9]+)+\s*(,|\{)/;

function say(text) {
  REPORT.push(text);
  console.log(text);
}

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
    .replace(/<(img|input|br|hr|meta|link)\b([^>]*?)\s*\/?>/g, '<$1$2 />');
}

function appendAfter(body, anchor, added) {
  if (!added.length) return body;

  const rows = body.split('\n');
  const at = rows.indexOf(anchor);

  if (at === -1) throw new Error('the react template has no line reading "' + anchor.trim() + '"');

  rows.splice(at + 1, 0, ...added);
  return rows.join('\n');
}

function replaceBetween(body, open, close, block) {
  const rows = body.split('\n');
  const from = rows.indexOf(open);
  const to = rows.indexOf(close);

  if (from === -1 || to === -1) throw new Error('the react template has no fragment to fill');

  rows.splice(from + 1, to - from - 1, ...block.split('\n'));
  return rows.join('\n');
}

function fillNames(body, project_name) {
  return body
    .split('ComponentName').join(toPascalCase(project_name))
    .split('component-name').join(project_name);
}

function readTagRules(css) {
  return css
    .split('\n')
    .map((line, index) => ({ line: line.trim(), number: index + 1 }))
    .filter((entry) => TAG_RULE_PATTERN.test(entry.line));
}

function readLabels(markup) {
  const labels = [];
  let match;
  LABEL_PATTERN.lastIndex = 0;

  while ((match = LABEL_PATTERN.exec(markup)) !== null) {
    if (!labels.includes(match[1])) labels.push(match[1]);
  }

  return labels;
}

function splitTemplates(templates) {
  const item = templates.find((entry) => /\bdata-item\b/.test(entry.markup));
  const shell = templates.find((entry) => entry !== item);

  return { shell, item };
}

function bindLabels(markup, indent) {
  return markup
    .split('\n')
    .map((line) => {
      LABEL_PATTERN.lastIndex = 0;
      const found = LABEL_PATTERN.exec(line);
      if (!found) return line;

      return line.replace(
        /(<([a-z]+)([^>]*\bdata-label=["'][A-Za-z_][A-Za-z0-9_]*["'][^>]*)>)\s*<\/\2>/,
        '$1{row?.' + found[1] + " || ''}</$2>",
      );
    })
    .map((line) => (line.trim() ? indent + line.trim() : line))
    .join('\n');
}

function buildComponent(project_name, source, template) {
  const { shell, item } = splitTemplates(readTemplates(source));
  const fields = readFields(source);

  const labels = item ? readLabels(item.markup) : [];
  const row_lines = labels
    .filter((label) => label !== 'id')
    .map((label) => '  ' + label + '?: string;');

  const props = [];
  const signature = [];

  fields.forEach((field) => {
    if (field.name === 'data') return;
    props.push('  ' + field.name + '?: ' + typeFor(field) + ';');
    signature.push('  ' + field.name + ' = ' + defaultFor(field) + ',');
  });

  let body = appendAfter(template, ROW_ANCHOR, row_lines);
  body = appendAfter(body, PROPS_ANCHOR, props);
  body = appendAfter(body, SIGNATURE_ANCHOR, signature);

  if (item) {
    const inner = item.markup.replace(ITEM_TEMPLATE_PATTERN, '$1').trim();
    body = replaceBetween(body, ITEM_OPEN, ITEM_CLOSE, bindLabels(toJsx(inner), '          '));
  }

  if (shell) {
    const chrome = shellChrome(shell.markup);
    if (chrome.length) body = appendAfter(body, SHELL_OPEN, chrome);
  }

  return fillNames(body, project_name);
}

function shellChrome(markup) {
  const inner = markup
    .replace(/^<[a-z]+[^>]*>/, '')
    .replace(/<\/[a-z]+>\s*$/, '')
    .trim();

  if (!inner) return [];

  return bindLabels(toJsx(inner), '      ')
    .split('\n')
    .filter((line) => line.trim());
}

function buildStory(project_name, source, template) {
  const { item } = splitTemplates(readTemplates(source));
  const fields = readFields(source);

  const labels = item ? readLabels(item.markup) : ['id'];
  const rows =
    'const ROWS = [' +
    [1, 2, 3]
      .map(
        (n) =>
          '{ ' +
          labels.map((label) => label + ": '" + label + ' ' + n + "'").join(', ') +
          ' }',
      )
      .join(', ') +
    '];';

  const args = [];

  fields.forEach((field) => {
    if (field.name === 'data') return;
    if (defaultFor(field) === 'undefined') return;
    args.push('    ' + field.name + ': ' + defaultFor(field) + ',');
  });

  let body = replaceLine(template, ROWS_ANCHOR, rows);
  body = appendAfter(body, ARGS_ANCHOR, args);

  return fillNames(body, project_name);
}

function replaceLine(body, prefix, replacement) {
  const rows = body.split('\n');
  const at = rows.findIndex((line) => line.startsWith(prefix));

  if (at === -1) throw new Error('the react template has no line starting "' + prefix + '"');

  rows[at] = replacement;
  return rows.join('\n');
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

  const { item } = splitTemplates(templates);

  if (templates.length && !item) {
    blockers.push({
      what: 'no data-item template',
      detail: 'no template carries a data-item element, so there is no row to repeat',
      fix: 'mark the repeating element with data-item, and each field inside it with data-label="<key>". the conversion reads those two attributes and nothing else',
    });
  }

  if (item && !readLabels(item.markup).length) {
    blockers.push({
      what: 'the row has no data-label fields',
      detail: 'the data-item template carries no data-label attribute, so no value can be bound',
      fix: 'give each field inside the row a data-label="<key>" naming the property it shows',
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

  const decisions = [];

  const tag_rules = readTagRules(css);
  if (tag_rules.length) {
    blockers.push({
      what: 'project.css targets a tag name',
      detail: tag_rules.map((entry) => 'line ' + entry.number + ': ' + entry.line).join('\n              '),
      fix: 'the tag does not survive the move, and project.css is the half that ships. move these rules to css/host.css, which stays behind, or write them against a class if the component actually needs them',
    });
  }

  let asset;
  ASSET_PATTERN.lastIndex = 0;
  while ((asset = ASSET_PATTERN.exec(source)) !== null) {
    decisions.push({
      what: 'asset path',
      detail: asset[1],
      fix: 'this was relative to the project folder and is relative to nothing once the component moves',
    });
  }

  const hex = css.split('\n')
    .map((line, index) => ({ line: line.trim(), number: index + 1 }))
    .filter((entry) => HEX_PATTERN.test(entry.line));

  if (hex.length) {
    decisions.push({
      what: 'raw colour values',
      detail: hex.map((entry) => 'line ' + entry.number + ': ' + entry.line).join('\n              '),
      fix: 'the design system wants tokens, not hex. the stylesheet ships as it stands and renders correctly — port these when you care to',
    });
  }

  return { blockers, decisions };
}

async function copyShipped(project_name, destination, component_source, story_source) {
  const project = join(PROJECTS, project_name);
  const carried = [];

  await writeFile(join(destination, project_name + '.tsx'), component_source);
  carried.push(project_name + '.tsx');

  await writeFile(join(destination, project_name + '.stories.tsx'), story_source);
  carried.push(project_name + '.stories.tsx');

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

  const losses = join(destination, 'LOSSES.txt');
  if (await exists(losses)) await rm(losses);

  await RUN('powershell', [
    '-NoProfile',
    '-Command',
    'Compress-Archive -Path "' + join(destination, '*') + '" -DestinationPath "' + archive + '" -Force',
  ]);

  return archive;
}

function report(title, entries) {
  if (!entries.length) return;
  say('  ' + title);
  entries.forEach((entry) => {
    say('    ' + entry.what + ' — ' + entry.detail);
    say('      ' + entry.fix);
  });
  say('');
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

  say('ship-new-project — ' + project_name);
  say('');

  if (blockers.length) {
    report('blocked', blockers);
    say('  nothing was written');
    say('');
    say('  these are the parts of the conversion a script cannot do for you.');
    say('  fix them in the project, then run this again');
    process.exit(1);
  }

  const destination = join(SHIPPED, project_name);
  await mkdir(destination, { recursive: true });

  const component_template = await readFile(join(TEMPLATES, 'component-name.tsx'), 'utf8');
  const story_template = await readFile(join(TEMPLATES, 'component-name.stories.tsx'), 'utf8');

  const component_source = buildComponent(project_name, source, component_template);
  const story_source = buildStory(project_name, source, story_template);
  const carried = await copyShipped(project_name, destination, component_source, story_source);
  await zip(destination, project_name);

  say('  written    shipped/' + project_name);
  carried.forEach((name) => say('    ' + name));
  say('  zipped     ' + project_name + '.zip');
  say('');

  report('decisions left to you', decisions);

  say('  the markup carried over as it stood. what the script filled in');
  say('  is not filled in for you — the expressions between the tags are');
  say('  yours to write, and the demo is what to check them against');

  await writeFile(join(destination, 'LOSSES.txt'), REPORT.join('\n') + '\n');
}

run().catch((error) => {
  console.error('ship-new-project — stopped');
  console.error('  ' + error.message);
  process.exit(1);
});
