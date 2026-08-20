class ItemList extends HTMLElement {
  #items = [];
  #value = null;

  connectedCallback() {
    if (!this.querySelector('ul')) this.append(document.createElement('ul'));
    this.render();
  }

  get items() {
    return this.#items;
  }

  set items(next) {
    this.#items = next || [];
    this.render();
  }

  get value() {
    return this.#value;
  }

  set value(next) {
    if (next === this.#value) return;
    const found = this.#items.find((item) => item.name === next);
    if (!found) return;
    this.#value = next;
    this.render();
    this.dispatchEvent(new CustomEvent('select', { detail: found, bubbles: true }));
  }

  render() {
    const list = this.querySelector('ul');
    if (!list) return;
    list.replaceChildren();

    if (!this.#items.length) {
      const empty = document.createElement('li');
      empty.textContent = this.dataset.empty || 'Nothing here';
      list.append(empty);
      return;
    }

    this.#items.forEach((item) => {
      const row = document.createElement('li');
      const link = document.createElement('a');
      link.href = item.path;
      link.textContent = item.name;
      if (item.name === this.#value) link.setAttribute('aria-current', 'page');
      link.addEventListener('click', (event) => {
        event.preventDefault();
        this.value = item.name;
      });
      row.append(link);
      list.append(row);
    });
  }
}

customElements.define('item-list', ItemList);
