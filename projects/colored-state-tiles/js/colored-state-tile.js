class ColoredStateTile extends HTMLElement {
  #title = '';
  #value = '';
  #label = '';
  #color = '';

  connectedCallback() {
    this.classList.add('colored-state-tile');
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
    const title = document.createElement('div');
    title.classList.add('title');
    if (this.#color) title.style.color = this.#color;
    title.textContent = this.#title + ' (' + this.#value + ')';

    const label = document.createElement('div');
    label.classList.add('label');
    label.textContent = this.#label;

    this.replaceChildren(title, label);
  }
}

customElements.define('colored-state-tile', ColoredStateTile);
