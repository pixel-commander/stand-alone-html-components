export function find(selector, scope) {
  return (scope || document).querySelector(selector);
}

export function findAll(selector, scope) {
  return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
}

export function stateClass(key) {
  return key.replace(/_/g, '-');
}

export function setState(node, key, value) {
  if (!node) return;
  node.classList.toggle(stateClass(key), Boolean(value));
}

export function selectOne(nodes, chosen, key) {
  nodes.forEach(function (node) {
    setState(node, key || 'is_selected', node === chosen);
  });
}

export function on(node, type, handler) {
  if (!node) return function () {};
  node.addEventListener(type, handler);
  return function () { node.removeEventListener(type, handler); };
}
