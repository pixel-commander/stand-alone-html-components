const COMPONENT_TEMPLATE = document.createElement('template');
COMPONENT_TEMPLATE.innerHTML = `
<div class="chart-container gauge-chart-container">
  <svg data-id="gauge chart" class="chart gauge-chart"></svg>
</div>
`;

const TRACK_TEMPLATE = document.createElement('template');
TRACK_TEMPLATE.innerHTML = `
<svg>
  <path class="gauge-track" d />
</svg>
`;

const BAND_TEMPLATE = document.createElement('template');
BAND_TEMPLATE.innerHTML = `
<svg>
  <path class="gauge-band" fill d />
</svg>
`;

const TICK_TEMPLATE = document.createElement('template');
TICK_TEMPLATE.innerHTML = `
<svg>
  <path class="gauge-tick" d />
</svg>
`;

const LABEL_TEMPLATE = document.createElement('template');
LABEL_TEMPLATE.innerHTML = `
<svg>
  <text class="gauge-label" x y></text>
</svg>
`;

const NEEDLE_TEMPLATE = document.createElement('template');
NEEDLE_TEMPLATE.innerHTML = `
<svg>
  <path class="gauge-needle" d />
</svg>
`;

const PIVOT_TEMPLATE = document.createElement('template');
PIVOT_TEMPLATE.innerHTML = `
<svg>
  <circle class="gauge-pivot" cx cy r />
</svg>
`;

class GaugeCharts extends HTMLElement {
  #gauge_type = 'full';
  #start_angle = null;
  #end_angle = null;
  #min = 0;
  #max = 0;
  #value = 0;
  #color = '#4caf50';
  #thresholds = [];
  #colors = [];
  #tick_count = 6;
  #padding = 5;
  #size = null;

  connectedCallback() {
    this.render();
  }

  get gauge_type() {
    return this.#gauge_type;
  }

  set gauge_type(next) {
    this.#gauge_type = next || 'full';
    this.render();
  }

  get start_angle() {
    return this.#start_angle;
  }

  set start_angle(next) {
    this.#start_angle = Number.isFinite(next) ? next : null;
    this.render();
  }

  get end_angle() {
    return this.#end_angle;
  }

  set end_angle(next) {
    this.#end_angle = Number.isFinite(next) ? next : null;
    this.render();
  }

  get min() {
    return this.#min;
  }

  set min(next) {
    this.#min = Number.isFinite(next) ? next : 0;
    this.render();
  }

  get max() {
    return this.#max;
  }

  set max(next) {
    this.#max = Number.isFinite(next) ? next : 0;
    this.render();
  }

  get value() {
    return this.#value;
  }

  set value(next) {
    this.#value = Number.isFinite(next) ? next : 0;
    this.render();
  }

  get color() {
    return this.#color;
  }

  set color(next) {
    this.#color = next || '#4caf50';
    this.render();
  }

  get thresholds() {
    return this.#thresholds;
  }

  set thresholds(next) {
    this.#thresholds = next || [];
    this.render();
  }

  get colors() {
    return this.#colors;
  }

  set colors(next) {
    this.#colors = next || [];
    this.render();
  }

  get tick_count() {
    return this.#tick_count;
  }

  set tick_count(next) {
    this.#tick_count = Number.isFinite(next) ? next : 6;
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

    this.#size = useContainerSize(this.querySelector('.gauge-chart-container'), () => this.draw());
    this.draw();
  }

  draw() {
    const chart = this.querySelector('.gauge-chart');
    if (!chart || !this.#size) return;

    chart.setAttribute('viewBox', '0 0 ' + this.#size.width + ' ' + this.#size.height);
    chart.replaceChildren();

    const gauge = generateGaugeChart({
      gauge_type: this.#gauge_type,
      start_angle: this.#start_angle,
      end_angle: this.#end_angle,
      min: this.#min,
      max: this.#max,
      value: this.#value,
      color: this.#color,
      thresholds: this.#thresholds,
      colors: this.#colors,
      tick_count: this.#tick_count,
    }, this.#size, this.#padding);

    if (!gauge) return;

    const track = TRACK_TEMPLATE.content.querySelector('.gauge-track').cloneNode(true);

    track.setAttribute('d', gauge.track);
    chart.append(track);

    gauge.bands.forEach((band) => {
      const path = BAND_TEMPLATE.content.querySelector('.gauge-band').cloneNode(true);

      path.setAttribute('fill', band.color || '');
      path.setAttribute('d', band.d);
      chart.append(path);
    });

    gauge.ticks.forEach((tick) => {
      const path = TICK_TEMPLATE.content.querySelector('.gauge-tick').cloneNode(true);
      const text = LABEL_TEMPLATE.content.querySelector('.gauge-label').cloneNode(true);

      path.setAttribute('d', tick.d);
      text.setAttribute('x', tick.x);
      text.setAttribute('y', tick.y);
      text.textContent = tick.label;

      chart.append(path);
      chart.append(text);
    });

    if (gauge.needle) {
      const needle = NEEDLE_TEMPLATE.content.querySelector('.gauge-needle').cloneNode(true);

      needle.setAttribute('d', gauge.needle);
      chart.append(needle);
    }

    const pivot = PIVOT_TEMPLATE.content.querySelector('.gauge-pivot').cloneNode(true);

    pivot.setAttribute('cx', gauge.center_x);
    pivot.setAttribute('cy', gauge.center_y);
    pivot.setAttribute('r', gauge.pivot);
    chart.append(pivot);
  }
}

customElements.define('gauge-charts', GaugeCharts);
