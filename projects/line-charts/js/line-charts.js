const COMPONENT_TEMPLATE = document.createElement('template');
COMPONENT_TEMPLATE.innerHTML = `
<div class="chart-container line-chart-container">
  <svg data-id="line chart" class="chart line-chart"></svg>
</div>
`;

const RULE_TEMPLATE = document.createElement('template');
RULE_TEMPLATE.innerHTML = `
<svg>
  <path class="line-rule" d />
</svg>
`;

const LINE_TEMPLATE = document.createElement('template');
LINE_TEMPLATE.innerHTML = `
<svg>
  <path class="line-series" stroke d />
</svg>
`;

const LABEL_TEMPLATE = document.createElement('template');
LABEL_TEMPLATE.innerHTML = `
<svg>
  <text class="line-label" x y></text>
</svg>
`;

const UNIT_TEMPLATE = document.createElement('template');
UNIT_TEMPLATE.innerHTML = `
<svg>
  <text class="line-unit" x y></text>
</svg>
`;

class LineCharts extends HTMLElement {
  #left_keys = [];
  #left_key = '';
  #bottom_key = '';
  #timestamp_key = '';
  #right_key = '';
  #scale_type = '';
  #data = [];
  #domains = null;
  #colors = null;
  #color_key = '';
  #zoom_x = true;
  #zoom_y = true;
  #start = null;
  #end = null;
  #domain_padding = true;
  #axis = null;
  #padding = 5;
  #size = null;

  connectedCallback() {
    this.render();
  }

  get left_keys() {
    return this.#left_keys;
  }

  set left_keys(next) {
    this.#left_keys = next || [];
    this.render();
  }

  get left_key() {
    return this.#left_key;
  }

  set left_key(next) {
    this.#left_key = next || '';
    this.render();
  }

  get bottom_key() {
    return this.#bottom_key;
  }

  set bottom_key(next) {
    this.#bottom_key = next || '';
    this.render();
  }

  get timestamp_key() {
    return this.#timestamp_key;
  }

  set timestamp_key(next) {
    this.#timestamp_key = next || '';
    this.render();
  }

  get right_key() {
    return this.#right_key;
  }

  set right_key(next) {
    this.#right_key = next || '';
    this.render();
  }

  get scale_type() {
    return this.#scale_type;
  }

  set scale_type(next) {
    this.#scale_type = next || '';
    this.render();
  }

  get data() {
    return this.#data;
  }

  set data(next) {
    this.#data = next || [];
    this.render();
  }

  get domains() {
    return this.#domains;
  }

  set domains(next) {
    this.#domains = next || null;
    this.render();
  }

  get colors() {
    return this.#colors;
  }

  set colors(next) {
    this.#colors = next || null;
    this.render();
  }

  get color_key() {
    return this.#color_key;
  }

  set color_key(next) {
    this.#color_key = next || '';
    this.render();
  }

  get zoom_x() {
    return this.#zoom_x;
  }

  set zoom_x(next) {
    this.#zoom_x = next !== false;
    this.render();
  }

  get zoom_y() {
    return this.#zoom_y;
  }

  set zoom_y(next) {
    this.#zoom_y = next !== false;
    this.render();
  }

  get start() {
    return this.#start;
  }

  set start(next) {
    this.#start = next || null;
    this.render();
  }

  get end() {
    return this.#end;
  }

  set end(next) {
    this.#end = next || null;
    this.render();
  }

  get domain_padding() {
    return this.#domain_padding;
  }

  set domain_padding(next) {
    this.#domain_padding = next !== false;
    this.render();
  }

  get axis() {
    return this.#axis;
  }

  set axis(next) {
    this.#axis = next || null;
    this.render();
  }

  get padding() {
    return this.#padding;
  }

  set padding(next) {
    this.#padding = Number.isFinite(next) ? next : 5;
    this.render();
  }

  render() {
    const component = COMPONENT_TEMPLATE.content.cloneNode(true);
    this.replaceChildren(component);

    this.#size = useContainerSize(this.querySelector('.line-chart-container'), () => this.draw());
    this.draw();
  }

  draw() {
    const chart = this.querySelector('.line-chart');
    if (!chart || !this.#size) return;

    chart.setAttribute('viewBox', '0 0 ' + this.#size.width + ' ' + this.#size.height);
    chart.replaceChildren();

    const line_chart = generateLineChart({
      left_keys: this.#left_keys,
      left_key: this.#left_key,
      bottom_key: this.#bottom_key,
      timestamp_key: this.#timestamp_key,
      right_key: this.#right_key,
      scale_type: this.#scale_type,
      data: this.#data,
      domains: this.#domains,
      colors: this.#colors,
      color_key: this.#color_key,
      zoom_x: this.#zoom_x,
      zoom_y: this.#zoom_y,
      start: this.#start,
      end: this.#end,
      domain_padding: this.#domain_padding,
      axis: this.#axis,
    }, this.#size, this.#padding);

    if (!line_chart) return;

    line_chart.rules.forEach((rule) => {
      const path = RULE_TEMPLATE.content.querySelector('.line-rule').cloneNode(true);
      const left = LABEL_TEMPLATE.content.querySelector('.line-label').cloneNode(true);

      path.setAttribute('d', rule.d);
      chart.append(path);

      left.setAttribute('x', line_chart.plot_left);
      left.setAttribute('y', rule.y);
      left.dataset.side = 'left';
      left.textContent = rule.left;
      chart.append(left);

      if (line_chart.left_unit) {
        const unit = UNIT_TEMPLATE.content.querySelector('.line-unit').cloneNode(true);

        unit.setAttribute('x', line_chart.plot_left);
        unit.setAttribute('y', rule.unit_y);
        unit.dataset.side = 'left';
        unit.textContent = line_chart.left_unit;
        chart.append(unit);
      }

      if (!line_chart.has_right) return;

      const right = LABEL_TEMPLATE.content.querySelector('.line-label').cloneNode(true);

      right.setAttribute('x', line_chart.plot_right);
      right.setAttribute('y', rule.y);
      right.dataset.side = 'right';
      right.textContent = rule.right;
      chart.append(right);

      if (!line_chart.right_unit) return;

      const unit = UNIT_TEMPLATE.content.querySelector('.line-unit').cloneNode(true);

      unit.setAttribute('x', line_chart.plot_right);
      unit.setAttribute('y', rule.unit_y);
      unit.dataset.side = 'right';
      unit.textContent = line_chart.right_unit;
      chart.append(unit);
    });

    line_chart.ticks.forEach((tick) => {
      const label = LABEL_TEMPLATE.content.querySelector('.line-label').cloneNode(true);

      label.setAttribute('x', tick.x);
      label.setAttribute('y', line_chart.label_y);
      label.dataset.side = 'bottom';
      label.textContent = tick.label;
      chart.append(label);

      if (!line_chart.bottom_unit) return;

      const unit = UNIT_TEMPLATE.content.querySelector('.line-unit').cloneNode(true);

      unit.setAttribute('x', tick.x);
      unit.setAttribute('y', line_chart.unit_label_y);
      unit.dataset.side = 'bottom';
      unit.textContent = line_chart.bottom_unit;
      chart.append(unit);
    });

    line_chart.lines.forEach((line) => {
      if (!line.d) return;

      const path = LINE_TEMPLATE.content.querySelector('.line-series').cloneNode(true);

      path.dataset.key = line.key || '';
      path.setAttribute('stroke', line.color);
      path.setAttribute('d', line.d);
      chart.append(path);
    });
  }
}

customElements.define('line-charts', LineCharts);
