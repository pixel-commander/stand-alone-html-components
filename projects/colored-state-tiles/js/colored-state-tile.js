const TILE_TEMPLATE = document.createElement('template');
TILE_TEMPLATE.innerHTML = `
<div class="colored-state-tile">
  <div class="title"></div>
  <div class="label"></div>
</div>
`;

class ColoredStateTile extends HTMLElement {
  #title = '';
  #value = '';
  #label = '';
  #color = '';

  connectedCallback() {
    this.render();
  }

  get title() {
    return this.#title;
  }

  set title(next) {
    this.#title = next || '';
    this.render();
  }

  get value() {
    return this.#value;
  }

  set value(next) {
    this.#value = next;
    this.render();
  }

  get label() {
    return this.#label;
  }

  set label(next) {
    this.#label = next || '';
    this.render();
  }

  get color() {
    return this.#color;
  }

  set color(next) {
    this.#color = next || '';
    this.render();
  }

  render() {
    const tile = TILE_TEMPLATE.content.cloneNode(true);

    const title = tile.querySelector('.title');
    if (this.#color) title.style.color = this.#color;
    title.textContent = this.#title + ' (' + this.#value + ')';

    tile.querySelector('.label').textContent = this.#label;

    this.replaceChildren(tile);
  }
}

customElements.define('colored-state-tile', ColoredStateTile);
