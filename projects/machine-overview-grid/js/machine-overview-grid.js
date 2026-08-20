const PANEL_TEMPLATE = document.createElement('template');
PANEL_TEMPLATE.innerHTML = `
<div class="machine-overview-grid">
  <div data-area="icon"><img alt=""></div>
  <header data-area="header">
    <div class="title"></div>
    <div class="value"></div>
  </header>
  <div data-area="spacer"></div>
  <div data-area="main" class="machine-overview-details">
    <div class="cell name heading"></div>
    <div class="cell target heading">Target</div>
    <div class="cell actual heading">Actual Value</div>
  </div>
</div>
`;

const ROW_TEMPLATE = document.createElement('template');
ROW_TEMPLATE.innerHTML = `
<div class="cell name"></div>
<div class="cell target"></div>
<div class="cell actual"></div>
`;

class MachineOverviewGrid extends HTMLElement {
  #data = [];
  #icon = '';
  #color = '';
  #title = '';
  #value = '';

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
    const panel = PANEL_TEMPLATE.content.cloneNode(true);

    const icon = panel.querySelector('[data-area="icon"]');
    if (this.#color) icon.style.background = this.#color;

    const mark = panel.querySelector('[data-area="icon"] img');
    if (this.#icon) mark.src = this.#icon;
    else mark.remove();

    panel.querySelector('.title').textContent = this.#title;
    panel.querySelector('.value').textContent = this.#value;

    const main = panel.querySelector('[data-area="main"]');

    this.#data.forEach((row) => {
      const cells = ROW_TEMPLATE.content.cloneNode(true);
      cells.querySelector('.name').textContent = row.name;
      cells.querySelector('.target').textContent = row.target;
      cells.querySelector('.actual').textContent = row.actual;
      main.append(cells);
    });

    this.replaceChildren(panel);
  }
}

customElements.define('machine-overview-grid', MachineOverviewGrid);
