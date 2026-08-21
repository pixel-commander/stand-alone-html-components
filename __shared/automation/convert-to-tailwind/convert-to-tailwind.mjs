import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..', '..');
const PROJECTS = join(ROOT, 'projects');

const SHORTHAND_SIDES = {
  margin: ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
  padding: ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
};

const REM = 16;

const SPACING = {
  '0px': '0', '1px': 'px', '2px': '0.5', '4px': '1', '6px': '1.5', '8px': '2',
  '10px': '2.5', '12px': '3', '14px': '3.5', '16px': '4', '20px': '5', '24px': '6',
  '28px': '7', '32px': '8', '36px': '9', '40px': '10', '44px': '11', '48px': '12',
  '56px': '14', '64px': '16', '80px': '20', '96px': '24', '112px': '28', '128px': '32',
  '144px': '36', '160px': '40', '176px': '44', '192px': '48', '208px': '52', '224px': '56',
  '240px': '60', '256px': '64', '288px': '72', '320px': '80', '384px': '96',
};

const SIZING = {
  ...SPACING,
  '100%': 'full', auto: 'auto', '50%': '1/2', '33.3333%': '1/3', '66.6667%': '2/3',
  '25%': '1/4', '75%': '3/4', '100vw': 'screen', '100vh': 'screen',
  'min-content': 'min', 'max-content': 'max', 'fit-content': 'fit',
};

const WEIGHTS = { 100: 'thin', 200: 'extralight', 300: 'light', 400: 'normal', 500: 'medium', 600: 'semibold', 700: 'bold', 800: 'extrabold', 900: 'black' };
const RADIUS = { '0px': 'none', '2px': 'sm', '4px': 'DEFAULT', '6px': 'md', '8px': 'lg', '12px': 'xl', '16px': '2xl', '24px': '3xl', '9999px': 'full' };
const BORDER = { '0px': '0', '1px': 'DEFAULT', '2px': '2', '4px': '4', '8px': '8' };
const OPACITY = { 0: '0', 0.05: '5', 0.1: '10', 0.25: '25', 0.5: '50', 0.75: '75', 0.9: '90', 1: '100' };

const WORD = (pairs) => pairs;

const DISPLAY = WORD({ block: 'block', 'inline-block': 'inline-block', inline: 'inline', flex: 'flex', 'inline-flex': 'inline-flex', table: 'table', grid: 'grid', 'inline-grid': 'inline-grid', contents: 'contents', 'list-item': 'list-item', none: 'hidden', 'flow-root': 'flow-root' });

const NAMED = {
  display: DISPLAY,
  position: WORD({ static: 'static', fixed: 'fixed', absolute: 'absolute', relative: 'relative', sticky: 'sticky' }),
  visibility: WORD({ visible: 'visible', hidden: 'invisible', collapse: 'collapse' }),
  'flex-direction': WORD({ row: 'flex-row', 'row-reverse': 'flex-row-reverse', column: 'flex-col', 'column-reverse': 'flex-col-reverse' }),
  'flex-wrap': WORD({ wrap: 'flex-wrap', 'wrap-reverse': 'flex-wrap-reverse', nowrap: 'flex-nowrap' }),
  flex: WORD({ '1 1 0%': 'flex-1', '1 1 auto': 'flex-auto', '0 1 auto': 'flex-initial', '0 0 auto': 'flex-none' }),
  'justify-content': WORD({ 'flex-start': 'justify-start', 'flex-end': 'justify-end', center: 'justify-center', 'space-between': 'justify-between', 'space-around': 'justify-around', 'space-evenly': 'justify-evenly', stretch: 'justify-stretch' }),
  'justify-items': WORD({ start: 'justify-items-start', end: 'justify-items-end', center: 'justify-items-center', stretch: 'justify-items-stretch' }),
  'align-items': WORD({ 'flex-start': 'items-start', 'flex-end': 'items-end', center: 'items-center', baseline: 'items-baseline', stretch: 'items-stretch' }),
  'align-content': WORD({ 'flex-start': 'content-start', 'flex-end': 'content-end', center: 'content-center', 'space-between': 'content-between', 'space-around': 'content-around', 'space-evenly': 'content-evenly' }),
  'align-self': WORD({ auto: 'self-auto', 'flex-start': 'self-start', 'flex-end': 'self-end', center: 'self-center', stretch: 'self-stretch', baseline: 'self-baseline' }),
  'place-content': WORD({ center: 'place-content-center', start: 'place-content-start', end: 'place-content-end', 'space-between': 'place-content-between', stretch: 'place-content-stretch' }),
  'place-items': WORD({ center: 'place-items-center', start: 'place-items-start', end: 'place-items-end', stretch: 'place-items-stretch' }),
  'place-self': WORD({ auto: 'place-self-auto', center: 'place-self-center', start: 'place-self-start', end: 'place-self-end', stretch: 'place-self-stretch' }),
  overflow: WORD({ auto: 'overflow-auto', hidden: 'overflow-hidden', clip: 'overflow-clip', visible: 'overflow-visible', scroll: 'overflow-scroll' }),
  'overflow-x': WORD({ auto: 'overflow-x-auto', hidden: 'overflow-x-hidden', clip: 'overflow-x-clip', visible: 'overflow-x-visible', scroll: 'overflow-x-scroll' }),
  'overflow-y': WORD({ auto: 'overflow-y-auto', hidden: 'overflow-y-hidden', clip: 'overflow-y-clip', visible: 'overflow-y-visible', scroll: 'overflow-y-scroll' }),
  'text-align': WORD({ left: 'text-left', center: 'text-center', right: 'text-right', justify: 'text-justify', start: 'text-start', end: 'text-end' }),
  'text-transform': WORD({ uppercase: 'uppercase', lowercase: 'lowercase', capitalize: 'capitalize', none: 'normal-case' }),
  'text-decoration-line': WORD({ underline: 'underline', overline: 'overline', 'line-through': 'line-through', none: 'no-underline' }),
  'text-overflow': WORD({ ellipsis: 'text-ellipsis', clip: 'text-clip' }),
  'font-style': WORD({ italic: 'italic', normal: 'not-italic' }),
  'white-space': WORD({ normal: 'whitespace-normal', nowrap: 'whitespace-nowrap', pre: 'whitespace-pre', 'pre-line': 'whitespace-pre-line', 'pre-wrap': 'whitespace-pre-wrap', 'break-spaces': 'whitespace-break-spaces' }),
  'word-break': WORD({ 'break-all': 'break-all', 'keep-all': 'break-keep' }),
  'list-style-type': WORD({ none: 'list-none', disc: 'list-disc', decimal: 'list-decimal' }),
  'list-style-position': WORD({ inside: 'list-inside', outside: 'list-outside' }),
  'box-sizing': WORD({ 'border-box': 'box-border', 'content-box': 'box-content' }),
  'flex-grow': WORD({ 0: 'grow-0', 1: 'grow' }),
  'flex-shrink': WORD({ 0: 'shrink-0', 1: 'shrink' }),
  'pointer-events': WORD({ none: 'pointer-events-none', auto: 'pointer-events-auto' }),
  'user-select': WORD({ none: 'select-none', text: 'select-text', all: 'select-all', auto: 'select-auto' }),
  resize: WORD({ none: 'resize-none', vertical: 'resize-y', horizontal: 'resize-x', both: 'resize' }),
  'table-layout': WORD({ auto: 'table-auto', fixed: 'table-fixed' }),
  'border-collapse': WORD({ collapse: 'border-collapse', separate: 'border-separate' }),
  'border-style': WORD({ solid: 'border-solid', dashed: 'border-dashed', dotted: 'border-dotted', double: 'border-double', none: 'border-none' }),
  'object-fit': WORD({ contain: 'object-contain', cover: 'object-cover', fill: 'object-fill', none: 'object-none', 'scale-down': 'object-scale-down' }),
  isolation: WORD({ isolate: 'isolate', auto: 'isolation-auto' }),
  'vertical-align': WORD({ baseline: 'align-baseline', top: 'align-top', middle: 'align-middle', bottom: 'align-bottom' }),
  float: WORD({ left: 'float-left', right: 'float-right', none: 'float-none' }),
  clear: WORD({ left: 'clear-left', right: 'clear-right', both: 'clear-both', none: 'clear-none' }),
  cursor: WORD({ auto: 'cursor-auto', default: 'cursor-default', pointer: 'cursor-pointer', wait: 'cursor-wait', text: 'cursor-text', move: 'cursor-move', 'not-allowed': 'cursor-not-allowed', 'col-resize': 'cursor-col-resize', 'row-resize': 'cursor-row-resize', grab: 'cursor-grab' }),
  'grid-auto-flow': WORD({ row: 'grid-flow-row', column: 'grid-flow-col', 'row dense': 'grid-flow-row-dense', 'column dense': 'grid-flow-col-dense' }),
};

const SCALED = {
  'margin-top': ['mt', SPACING], 'margin-right': ['mr', SPACING], 'margin-bottom': ['mb', SPACING], 'margin-left': ['ml', SPACING],
  'padding-top': ['pt', SPACING], 'padding-right': ['pr', SPACING], 'padding-bottom': ['pb', SPACING], 'padding-left': ['pl', SPACING],
  'column-gap': ['gap-x', SPACING], 'row-gap': ['gap-y', SPACING], gap: ['gap', SPACING],
  top: ['top', SIZING], right: ['right', SIZING], bottom: ['bottom', SIZING], left: ['left', SIZING],
  width: ['w', SIZING], height: ['h', SIZING],
  'min-width': ['min-w', SIZING], 'min-height': ['min-h', SIZING],
  'max-width': ['max-w', SIZING], 'max-height': ['max-h', SIZING],
  'flex-basis': ['basis', SIZING],
  'font-weight': ['font', WEIGHTS],
  'border-radius': ['rounded', RADIUS],
  'border-top-left-radius': ['rounded-tl', RADIUS], 'border-top-right-radius': ['rounded-tr', RADIUS],
  'border-bottom-left-radius': ['rounded-bl', RADIUS], 'border-bottom-right-radius': ['rounded-br', RADIUS],
  'border-width': ['border', BORDER], 'border-top-width': ['border-t', BORDER], 'border-right-width': ['border-r', BORDER],
  'border-bottom-width': ['border-b', BORDER], 'border-left-width': ['border-l', BORDER],
  'outline-width': ['outline', BORDER],
  opacity: ['opacity', OPACITY],
  'z-index': ['z', {}],
  order: ['order', {}],
  'font-size': ['text', {}],
  'line-height': ['leading', {}],
  'letter-spacing': ['tracking', {}],
  'grid-template-columns': ['grid-cols', {}],
  'grid-template-rows': ['grid-rows', {}],
  'grid-column': ['col', {}],
  'grid-row': ['row', {}],
  'aspect-ratio': ['aspect', {}],
  'transition-duration': ['duration', {}],
  'transition-delay': ['delay', {}],
};

const COLORED = {
  color: 'text', 'background-color': 'bg', 'border-color': 'border', 'outline-color': 'outline',
  'border-top-color': 'border-t', 'border-right-color': 'border-r',
  'border-bottom-color': 'border-b', 'border-left-color': 'border-l',
  'text-decoration-color': 'decoration', 'caret-color': 'caret', 'accent-color': 'accent',
  fill: 'fill', stroke: 'stroke',
};

const toArbitrary = (value) => String(value).trim().replace(/\s+/g, '_');

const toHex = (value) => {
  const found = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/.exec(String(value).trim());
  if (!found) return null;

  const hex = '#' + found.slice(1, 4).map((one) => Number(one).toString(16).padStart(2, '0')).join('');

  return found[4] !== undefined && Number(found[4]) < 1 ? null : hex;
};

const convertDeclarationValue = (value, values_map, prefix) => {
  const mapped = values_map[value];

  if (mapped) return mapped === 'DEFAULT' ? prefix : prefix + '-' + mapped;

  const arbitrary = toArbitrary(value);

  return arbitrary ? prefix + '-[' + arbitrary + ']' : '';
};

const toUtility = (property, value) => {
  const named = NAMED[property];
  if (named) return named[value] || '';

  const scaled = SCALED[property];
  if (scaled) return convertDeclarationValue(value, scaled[1], scaled[0]);

  const colored = COLORED[property];
  if (colored) {
    const hex = toHex(value);

    return hex ? colored + '-[' + hex + ']' : convertDeclarationValue(value, {}, colored);
  }

  return '';
};

const toClasses = (declarations) => {
  const classes = [];
  const unmapped = [];

  declarations.forEach(({ property, value }) => {
    const utility = toUtility(property, value);

    return utility ? classes.push(utility) : unmapped.push(property + ': ' + value);
  });

  return { classes: [...new Set(classes)], unmapped };
};

const toPx = (value) => value.replace(/(-?[\d.]+)rem/g, (whole, number) => Number(number) * REM + 'px');

const expand = (property, value) => {
  const sides = SHORTHAND_SIDES[property];
  if (!sides) return [{ property, value }];

  const parts = value.split(/\s+/);
  if (parts.length === 1) return sides.map((side) => ({ property: side, value: parts[0] }));
  if (parts.length === 2) return sides.map((side, index) => ({ property: side, value: parts[index % 2] }));
  if (parts.length === 3) return sides.map((side, index) => ({ property: side, value: index === 3 ? parts[1] : parts[index] }));
  if (parts.length === 4) return sides.map((side, index) => ({ property: side, value: parts[index] }));

  return [{ property, value }];
};

const readRules = (css) => {
  const without_comments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = [];
  const pattern = /([^{}]+)\{([^{}]*)\}/g;
  let found;

  while ((found = pattern.exec(without_comments)) !== null) {
    const selector = found[1].trim().replace(/\s+/g, ' ');
    if (!selector || selector.startsWith('@')) continue;

    const declarations = [];

    found[2].split(';').forEach((line) => {
      const at = line.indexOf(':');
      if (at === -1) return;

      const property = line.slice(0, at).trim();
      const value = toPx(line.slice(at + 1).trim());
      if (!property || !value) return;

      expand(property, value).forEach((one) => declarations.push(one));
    });

    if (declarations.length) rules.push({ selector, declarations });
  }

  return rules;
};

const exists = async (path) => {
  try {
    await stat(path);

    return true;
  } catch {
    return false;
  }
};

const toRecord = (rules) => {
  const record = {};

  rules.forEach((rule) => {
    const converted = toClasses(rule.declarations);
    const held = record[rule.selector];

    const classes = held ? [...new Set(held.classes.concat(converted.classes))] : converted.classes;
    const unmapped = held ? held.unmapped.concat(converted.unmapped) : converted.unmapped;

    record[rule.selector] = { classes, unmapped };
  });

  return Object.entries(record).map(([selector, one]) => ({
    selector,
    classes: one.classes.join(' '),
    unmapped: one.unmapped,
  }));
};

const run = async () => {
  const input = process.argv[2];
  const output = process.argv[3];

  if (!input || !output) {
    console.error('convert-to-tailwind — give it a stylesheet to read and a file to write');
    console.error('  node convert-to-tailwind.mjs <input.css> <output.json>');
    process.exit(1);
  }

  if (!(await exists(input))) {
    console.error('convert-to-tailwind — nothing to read at ' + input);
    process.exit(1);
  }

  if (await exists(output)) {
    console.error('convert-to-tailwind — ' + output + ' already exists');
    console.error('  nothing was written. a name already written is the name that stays');
    process.exit(1);
  }

  const rules = readRules(await readFile(input, 'utf8'));
  const converted = toRecord(rules);
  const left_alone = converted.reduce((count, one) => count + one.unmapped.length, 0);

  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, JSON.stringify(converted, null, 2));

  console.log('convert-to-tailwind');
  console.log('');
  console.log('  read       ' + input);
  console.log('  written    ' + output);
  console.log('  ' + converted.length + ' selector' + (converted.length === 1 ? '' : 's') + ' converted');

  if (left_alone) {
    console.log('  ' + left_alone + ' declaration' + (left_alone === 1 ? '' : 's') + ' with no utility to stand for them,');
    console.log('             carried into the file rather than dropped');
  }

  console.log('');
  console.log('  a selector is not an element, so which of these belong on which tag');
  console.log('  is yours to place');
};

run().catch((error) => {
  console.error('convert-to-tailwind — stopped');
  console.error('  ' + error.message);
  process.exit(1);
});
