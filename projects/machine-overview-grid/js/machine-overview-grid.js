class MachineOverviewGrid extends HTMLElement {
  #data = [];
  #icon = '';
  #color = '';
  #title = '';
  #value = '';

  connectedCallback() {
    this.classList.add('machine-overview-grid');
    this.render();
  }

  get data() {
    return this.#data;
  }

  set data(next) {
    this.#data = next || [];
    this.render();
  }

  get icon() {
    return this.#icon;
  }

  set icon(next) {
    this.#icon = next || '';
    this.render();
  }

  get color() {
    return this.#color;
  }

  set color(next) {
    this.#color = next || '';
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
    this.#value = next || '';
    this.render();
  }

  render() {
    const icon = document.createElement('div');
    icon.dataset.area = 'icon';
    if (this.#color) icon.style.background = this.#color;

    if (this.#icon) {
      const mark = document.createElement('img');
      mark.src = this.#icon;
      mark.alt = '';
      icon.append(mark);
    }

    const header = document.createElement('header');
    header.dataset.area = 'header';

    const title = document.createElement('div');
    title.classList.add('title');
    title.textContent = this.#title;

    const value = document.createElement('div');
    value.classList.add('value');
    value.textContent = this.#value;

    header.append(title, value);

    const spacer = document.createElement('div');
    spacer.dataset.area = 'spacer';

    const main = document.createElement('div');
    main.dataset.area = 'main';
    main.classList.add('machine-overview-details');

    const appendCell = (text) => {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.textContent = text;
      main.append(cell);
    };

    ['', 'Target', 'Actual Value'].forEach(appendCell);

    this.#data.forEach((row) => {
      [row.name, row.target, row.actual].forEach(appendCell);
    });

    this.replaceChildren(icon, header, spacer, main);
  }
}

customElements.define('machine-overview-grid', MachineOverviewGrid);
