import { useURL, onURLChange, go } from '../../../js/useURL.js';
import { linkCss, cssHref, noteHref, readText } from '../../../js/loader.js';
import { watch, paint } from '../../../js/controls.js';
import { find, findAll, selectOne, setState } from '../../../util/dom.js';

const ROOT = '../../../';
const TIERS = [
  { id: 'atoms', label: 'Atoms' },
  { id: 'elements', label: 'Elements' },
  { id: 'components', label: 'Components' },
  { id: 'pages', label: 'Pages' },
  { id: 'dashboards', label: 'Dashboards' }
];
const ACCENTS = ['primary', 'secondary', 'tertiary', 'quaternary'];

const stage = find('[data-stage]');
const notes = find('[data-notes] pre');
const keysBox = find('[data-keys]');
const modBar = find('[data-mods]');
const itemList = find('[data-items]');
const tierBar = find('[data-tiers]');
const accentBar = find('[data-accents]');
const partName = find('[data-part-name]');
const partPath = find('[data-part-path]');
const tierName = find('[data-tier-name]');

let manifest = {};

function partHrefFor(tier, item) {
  if (tier === 'atoms') return ROOT + 'atoms/' + item.kind + '/' + item.name + '/demo/index.html';
  return ROOT + tier + '/' + item.name + '/js/' + item.name + '.html';
}

function buildTiers() {
  tierBar.innerHTML = TIERS.map(function (tier) {
    return '<button class="button-main tab-nav-tab quiet" role="tab" data-tier="' + tier.id + '">' + tier.label + '</button>';
  }).join('');
  tierBar.addEventListener('click', function (event) {
    const button = event.target.closest('[data-tier]');
    if (button) go('update-path', { page: button.dataset.tier });
  });
}

function buildAccents() {
  accentBar.innerHTML = ACCENTS.map(function (name) {
    return '<button class="guide-accent chip-main round accent-' + name + '" data-accent="' + name + '" aria-label="' + name + '"></button>';
  }).join('');
  accentBar.addEventListener('click', function (event) {
    const button = event.target.closest('[data-accent]');
    if (button) go('update-var', { accent: button.dataset.accent });
  });
}

function buildOptions() {
  find('[data-mode] input').addEventListener('change', function (event) {
    go('update-var', { mode: event.target.checked ? 'light' : 'dark' });
  });
  find('[data-softness] input').addEventListener('input', function (event) {
    document.documentElement.style.setProperty('--softness', (event.target.value / 100).toFixed(2));
  });
  itemList.addEventListener('click', function (event) {
    const button = event.target.closest('[data-item]');
    if (button) go('update-path', { view: button.dataset.item });
  });
  modBar.addEventListener('click', function (event) {
    const button = event.target.closest('[data-mod-pick]');
    if (button) go('update-path', { tab: button.dataset.modPick });
  });
}

function paintList(tier, view) {
  const items = manifest[tier] || [];
  tierName.textContent = (TIERS.filter(function (t) { return t.id === tier; })[0] || {}).label || tier;
  itemList.innerHTML = items.map(function (item) {
    const on = item.name === view ? ' is-active' : '';
    return '<button class="button-main site-nav-item quiet square grid gap-md' + on + '" data-item="' + item.name + '">' +
      '<span></span><span>' + item.name + '</span><span class="site-nav-count">' + (item.kind === tier ? '' : '') + '</span></button>';
  }).join('');
  findAll('[data-tier]', tierBar).forEach(function (node) {
    setState(node, 'is_selected', node.dataset.tier === tier);
    node.setAttribute('aria-selected', String(node.dataset.tier === tier));
  });
}

function paintKeys(item) {
  const keys = item && item.keys;
  setState(keysBox, 'is_hidden', !keys || !keys.length);
  keysBox.innerHTML = !keys ? '' : keys.map(function (key) {
    return '<span class="chip-main guide-key sunken">' + key + '</span>';
  }).join('');
}

function paintMods(tab) {
  const groups = findAll('[data-mod]', stage);
  if (!groups.length) {
    setState(modBar, 'is_hidden', true);
    modBar.innerHTML = '';
    return;
  }
  const mods = ['all'].concat(groups.map(function (node) { return node.dataset.mod; }));
  setState(modBar, 'is_hidden', false);
  modBar.innerHTML = mods.map(function (mod) {
    const on = (tab || 'all') === mod ? ' is-selected' : '';
    return '<button class="button-main tab-nav-tab quiet' + on + '" role="tab" data-mod-pick="' + mod + '">' + mod + '</button>';
  }).join('');
  groups.forEach(function (node) {
    setState(node, 'is_hidden', Boolean(tab) && tab !== 'all' && node.dataset.mod !== tab);
  });
}

function showEmpty(tier) {
  partName.textContent = tier;
  partPath.textContent = '';
  keysBox.innerHTML = '';
  setState(keysBox, 'is_hidden', true);
  setState(modBar, 'is_hidden', true);
  stage.innerHTML = '<div class="guide-empty grid"><span class="ui-label">Placeholder</span>' +
    '<p class="ui-body">' + tier + ' are not built yet. The tier is here so the guide has a shape to grow into.</p></div>';
  notes.textContent = '';
}

async function render(state) {
  const path = state.url_path;
  const vars = state.url_vars;
  const tier = path.page || 'atoms';
  const items = manifest[tier] || [];

  document.body.classList.toggle('theme-soft-light', vars.mode === 'light');
  document.body.classList.toggle('theme-soft-dark', vars.mode !== 'light');
  find('[data-mode] input').checked = vars.mode === 'light';
  ACCENTS.forEach(function (name) {
    document.body.classList.toggle('accent-' + name, (vars.accent || 'primary') === name);
  });
  findAll('[data-accent]', accentBar).forEach(function (node) {
    setState(node, 'is_selected', node.dataset.accent === (vars.accent || 'primary'));
  });

  if (!items.length) {
    paintList(tier, null);
    return showEmpty(tier);
  }

  const item = items.filter(function (one) { return one.name === path.view; })[0] || items[0];
  paintList(tier, item.name);

  if (item.href) {
    partName.textContent = item.title;
    partPath.textContent = 'src/pages/' + item.href;
    setState(keysBox, 'is_hidden', true);
    setState(modBar, 'is_hidden', true);
    stage.innerHTML = '<div class="guide-empty grid">' +
      '<p class="ui-body">A page is a whole document, so it opens in its own window rather than in the stage.</p>' +
      '<a class="button-main button accent" href="../../' + item.href + '">Open ' + item.title + '</a></div>';
    notes.textContent = await readText(ROOT + 'pages/' + item.file + '/README.txt').catch(function () { return ''; });
    return;
  }

  partName.textContent = item.name;
  partPath.textContent = tier === 'atoms'
    ? 'src/atoms/' + item.kind + '/' + item.name + '/' + item.name + '.css'
    : 'src/' + tier + '/' + item.name + '/js/' + item.name + '.html';

  linkCss(cssHref(tier, item, ROOT));
  try {
    stage.innerHTML = await readText(partHrefFor(tier, item));
  } catch (problem) {
    stage.innerHTML = '<p class="ui-error">Could not load ' + item.name + '</p>';
  }
  paintKeys(item);
  paintMods(path.tab);
  paint(stage);

  if (item.script) {
    try {
      await import(ROOT + tier + '/' + item.name + '/js/' + item.script + '?at=' + Date.now());
    } catch (problem) {
      notes.textContent = '';
    }
  }

  try {
    notes.textContent = await readText(noteHref(tier, item, ROOT));
  } catch (problem) {
    notes.textContent = '';
  }
}

async function start() {
  manifest = JSON.parse(await readText(ROOT + 'manifest.json'));
  buildTiers();
  buildAccents();
  buildOptions();
  watch(document);
  onURLChange(render);
  const [state] = useURL();
  if (!state.url_path.main) return go('set-path', { main: 'style-guide', page: 'atoms' });
  render(state);
}

start();
