const COMPONENT_TEMPLATE = document.createElement('template');
COMPONENT_TEMPLATE.innerHTML = `
<div class="component-name">
</div>
`;

class ComponentName extends HTMLElement {
  #value = '';

  connectedCallback() {
    this.render();
  }

  get value() {
    return this.#value;
  }

  set value(next) {
    this.#value = next || '';
    this.render();
  }

  render() {
    const component = COMPONENT_TEMPLATE.content.cloneNode(true);

    this.replaceChildren(component);
  }
}

customElements.define('component-name', ComponentName);
