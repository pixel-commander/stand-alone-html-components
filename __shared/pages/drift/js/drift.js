import { useURL, onURLChange, go } from '../../../js/useURL.js';
import { watch } from '../../../js/controls.js';
import { find, findAll, setState } from '../../../util/dom.js';

function render(state) {
  const vars = state.url_vars;
  const path = state.url_path;
  document.body.classList.toggle('theme-soft-light', vars.mode === 'light');
  document.body.classList.toggle('theme-soft-dark', vars.mode !== 'light');
  if (vars.softness) document.documentElement.style.setProperty('--softness', (Number(vars.softness) / 100).toFixed(2));
  findAll('[data-nav]').forEach(function (node) {
    setState(node, 'is_active', node.dataset.nav === (path.page || 'today'));
  });
}

function start() {
  watch(document);
  onURLChange(render);
  findAll('[data-nav]').forEach(function (node) {
    node.addEventListener('click', function () { go('update-path', { page: node.dataset.nav }); });
  });
  const softness = find('[data-softness]');
  softness.addEventListener('change', function () { go('update-var', { softness: softness.value }); });
  const [state] = useURL();
  if (!state.url_path.main) return go('set-path', { main: 'drift', page: 'today' });
  render(state);
}

start();
