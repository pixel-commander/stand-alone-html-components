import { findAll, setState, find } from '../../../util/dom.js';

const READING = 1800;
const HELD = 1600;

function run(button) {
  if (button.classList.contains('is-dirty')) return;
  const note = find('[data-scan-note]', button);
  setState(button, 'is_selected', false);
  setState(button, 'is_dirty', true);
  if (note) note.textContent = 'reading';
  window.setTimeout(function () {
    setState(button, 'is_dirty', false);
    setState(button, 'is_selected', true);
    if (note) note.textContent = 'accepted';
    window.setTimeout(function () {
      setState(button, 'is_selected', false);
      if (note) note.textContent = 'touch to scan';
    }, HELD);
  }, READING);
}

export function watchScanButtons(scope) {
  findAll('[data-scan]', scope).forEach(function (button) {
    button.addEventListener('click', function () { run(button); });
    button.addEventListener('pointerdown', function () { setState(button, 'is_active', true); });
    button.addEventListener('pointerup', function () { setState(button, 'is_active', false); });
    button.addEventListener('pointerleave', function () { setState(button, 'is_active', false); });
  });
}

watchScanButtons(document);
