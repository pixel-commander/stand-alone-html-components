const TILES_TEMPLATE = document.createElement('template');
TILES_TEMPLATE.innerHTML = `
<div class="colored-state-tiles">
</div>
`;

class ColoredStateTiles extends HTMLElement {
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
    const tiles = TILES_TEMPLATE.content.cloneNode(true);
    const wrapper = tiles.querySelector('.colored-state-tiles');

    this.#data.forEach((row) => {
      const tile = document.createElement('colored-state-tile');
      tile.title = row.title;
      tile.value = row.value;
      tile.label = row.label;
      tile.color = row.color;
      wrapper.append(tile);
    });

    this.replaceChildren(tiles);
  }
}

customElements.define('colored-state-tiles', ColoredStateTiles);
