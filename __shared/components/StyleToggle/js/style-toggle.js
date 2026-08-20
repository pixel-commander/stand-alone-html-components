import { useURL, onURLChange, go } from '../../../js/useURL.js';
import { find, findAll, setState } from '../../../util/dom.js';

const SKINS = {
  neumorphism: { track: 'container-sunken pill', knob: 'container-raised round' },
  skeuomorphism: { track: 'container-carved pill', knob: 'container-domed round' },
  domed: { track: 'container-carved shallow pill', knob: 'container-domed round blurred' }
};

function wear(node, base, skin) {
  node.className = skin + ' ' + base;
}

export function paintStyleToggle(state) {
  const root = find('[data-style-toggle]');
  if (!root) return;
  const style = state.url_vars.style || 'neumorphism';
  const skin = SKINS[style] || SKINS.neumorphism;
  wear(find('[data-track]', root), 'style-toggle-track', skin.track);
  wear(find('[data-knob]', find('[data-track]', root)), 'style-toggle-knob', skin.knob);
  find('[data-mode]', root).checked = state.url_vars.mode === 'light';
  findAll('.style-toggle-style', root).forEach(function (label) {
    const input = label.querySelector('input');
    input.checked = input.value === style;
    setState(label, 'is_selected', input.checked);
  });
}

export function watchStyleToggle() {
  const root = find('[data-style-toggle]');
  if (!root) return;
  find('[data-mode]', root).addEventListener('change', function (event) {
    go('update-var', { mode: event.target.checked ? 'light' : 'dark' });
  });
  findAll('.style-toggle-style input', root).forEach(function (input) {
    input.addEventListener('change', function () { go('update-var', { style: input.value }); });
  });
  onURLChange(paintStyleToggle);
  paintStyleToggle(useURL()[0]);
}

watchStyleToggle();
