const COMPONENT_TEMPLATE = document.createElement('template');
COMPONENT_TEMPLATE.innerHTML = `
<div class="component-name flex flex-col min-h-0 overflow-auto">
</div>
`;

const ITEM_TEMPLATE = document.createElement('template');
ITEM_TEMPLATE.innerHTML = `
<div data-item class="flex flex-wrap gap-x-2">
  <div data-label="id" class="flex-none whitespace-nowrap font-semibold"></div>
</div>
`;

class ComponentName extends HTMLElement {
  #data = [];

  connectedCallback() {
    this.render();
  }

  get data() {
    return this.#data;
  }

  set data(next) {
    this.#data = next || [];
    this.render();
  }

  render() {
    const component = COMPONENT_TEMPLATE.content.cloneNode(true);
    const root = component.querySelector('.component-name');

    this.#data.forEach((row) => {
      const item = ITEM_TEMPLATE.content.cloneNode(true);

      item.querySelectorAll('[data-label]').forEach((field) => {
        field.textContent = row[field.dataset.label] || '';
      });

      root.append(item);
    });

    this.replaceChildren(component);
  }
}

customElements.define('component-name', ComponentName);
