class ColoredStateTiles extends HTMLElement {
  #data = [];

  connectedCallback() {
    this.classList.add('colored-state-tiles');
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
    const tiles = this.#data.map((row) => {
      const tile = document.createElement('colored-state-tile');
      tile.title = row.title;
      tile.value = row.value;
      tile.label = row.label;
      tile.color = row.color;
      return tile;
    });

    this.replaceChildren(...tiles);
  }
}

customElements.define('colored-state-tiles', ColoredStateTiles);
