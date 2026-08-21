const COMPONENT_TEMPLATE = document.createElement('template');
COMPONENT_TEMPLATE.innerHTML = `
<div class="chart-container pie-chart-container">
  <svg data-id="pie chart" class="chart pie-chart"></svg>
  <div class="values">
    <div class="pie-inner-title"></div>
    <div class="pie-inner-value"></div>
    <div class="pie-inner-label"></div>
  </div>
</div>
`;

const SLICE_TEMPLATE = document.createElement('template');
SLICE_TEMPLATE.innerHTML = `
<svg>
  <path class="pie-slice" data-group fill d />
</svg>
`;

class PieCharts extends HTMLElement {
  #data = [];
  #donut = true;
  #padding = 5;
  #inner_radius = 0.7;
  #unit = '';
  #show_values = false;
  #handleClick = null;
  #size = null;

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

  get donut() {
    return this.#donut;
  }

  set donut(next) {
    this.#donut = next !== false;
    this.render();
  }

  get padding() {
    return this.#padding;
  }

  set padding(next) {
    this.#padding = Number.isFinite(next) ? next : 5;
    this.render();
  }

  get inner_radius() {
    return this.#inner_radius;
  }

  set inner_radius(next) {
    this.#inner_radius = Number.isFinite(next) ? next : 0.6;
    this.render();
  }

  get unit() {
    return this.#unit;
  }

  set unit(next) {
    this.#unit = next || '';
    this.render();
  }

  get show_values() {
    return this.#show_values;
  }

  set show_values(next) {
    this.#show_values = next === true;
    this.render();
  }

  get handleClick() {
    return this.#handleClick;
  }

  set handleClick(next) {
    this.#handleClick = next || null;
    this.render();
  }

  render() {
    const component = COMPONENT_TEMPLATE.content.cloneNode(true);
    this.replaceChildren(component);

    this.#size = useContainerSize(this.querySelector('.pie-chart-container'), () => this.draw());
    this.draw();
  }

  draw() {
    const chart = this.querySelector('.pie-chart');
    if (!chart || !this.#size) return;

    const showValues = (item) => {
      const total = this.#data.reduce((sum, row) => sum + (row.value || 0), 0);
      const values = this.querySelector('.values');

      values.hidden = !this.#show_values;
      if (!this.#show_values) return;

      this.querySelector('.pie-inner-title').textContent = item ? item.group || '' : '';
      this.querySelector('.pie-inner-value').textContent = (item ? item.value || 0 : total) + this.#unit;
      this.querySelector('.pie-inner-label').textContent = item ? 'amount' : 'total';
    };

    const handleClickSlice = (e, item) => {
      const clear = e.currentTarget.classList.contains('is-selected');

      chart.querySelectorAll('.pie-slice').forEach((other) => {
        other.classList.remove('is-selected');
        other.classList.toggle('is-not-selected', !clear);
      });

      if (!clear) {
        e.currentTarget.classList.remove('is-not-selected');
        e.currentTarget.classList.add('is-selected');
      }

      handleHoverSlice(null);
      showValues(clear ? null : item);

      if (this.#handleClick) return this.#handleClick(item);
    };

    const slices = generatePieChart(this.#data, this.#donut, this.#size, this.#padding, this.#inner_radius);

    const handleHoverSlice = (hovered) => {
      const paths = chart.querySelectorAll('.pie-slice');
      const chosen = hovered === null
        ? [...paths].findIndex((other) => other.classList.contains('is-selected'))
        : hovered;

      paths.forEach((other, position) => {
        if (chosen === -1) return other.setAttribute('d', slices[position].d);

        other.setAttribute('d', position === chosen ? slices[position].d_hovered : slices[position].d_not_hovered);
      });
    };

    chart.setAttribute('viewBox', '0 0 ' + this.#size.width + ' ' + this.#size.height);
    chart.replaceChildren();

    slices.forEach((slice, index) => {
      const path = SLICE_TEMPLATE.content.querySelector('.pie-slice').cloneNode(true);

      path.dataset.group = slice.group || '';
      path.setAttribute('fill', slice.color || '');
      path.setAttribute('d', slice.d);
      path.addEventListener('click', (event) => handleClickSlice(event, this.#data[index]));
      path.addEventListener('mouseenter', () => handleHoverSlice(index));
      path.addEventListener('mouseleave', () => handleHoverSlice(null));

      chart.append(path);
    });

    showValues(null);
  }
}

customElements.define('pie-charts', PieCharts);
