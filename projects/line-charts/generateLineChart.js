const LEFT_GUTTER = 48;
const RIGHT_GUTTER = 48;
const BOTTOM_GUTTER = 28;
const TOP_GUTTER = 12;
const GRID_STEPS = 5;
const DEFAULT_COLOR = 'blue';

const toSorted = (data, timestamp_key) => {
  if (!timestamp_key) return data.slice();

  return data.slice().sort((one, two) => new Date(one[timestamp_key]) - new Date(two[timestamp_key]));
};

const toMoment = (at) => {
  if (at === null || at === undefined || at === '') return null;

  const moment = new Date(at).getTime();

  return Number.isFinite(moment) ? moment : null;
};

const toStep = (value) => {
  if (!value) return 10;

  return Math.pow(10, Math.floor(Math.log10(Math.abs(value))));
};

const toPadded = (lowest, highest) => {
  const step = toStep(Math.max(Math.abs(lowest), Math.abs(highest)));

  return [Math.floor(lowest / step) * step, Math.ceil(highest / step) * step];
};

const toRange = (domain) => {
  if (!domain) return null;
  if (Array.isArray(domain)) return domain;

  const lowest = Number.isFinite(domain.min) ? domain.min : null;
  const highest = Number.isFinite(domain.max) ? domain.max : null;

  return lowest === null && highest === null ? null : [lowest, highest];
};

const toUnit = (domain) => (domain && !Array.isArray(domain) && domain.unit ? domain.unit : '');

const toExtent = (rows, key, incoming, zoom_y, domain_padding) => {
  const domain = toRange(incoming);
  const values = rows.map((row) => Number(row[key])).filter((value) => Number.isFinite(value));
  const floor = zoom_y ? Math.min(...values) : Math.min(...values, 0);
  const lowest = domain && Number.isFinite(domain[0]) ? domain[0] : floor;
  const highest = domain && Number.isFinite(domain[1]) ? domain[1] : Math.max(...values, 0);
  const [from, to] = domain_padding ? toPadded(lowest, highest) : [lowest, highest];

  return from === to ? [from, from + 1] : [from, to];
};

const toAxis = (axis, side, fallback) => {
  const given = axis && axis[side] ? axis[side] : {};
  const settled = {};

  Object.keys(fallback).forEach((name) => {
    settled[name] = given[name] === undefined || given[name] === null ? fallback[name] : given[name];
  });

  if (Array.isArray(given.domain)) settled.domain = given.domain;
  if (Number.isFinite(given.min)) settled.min = given.min;
  if (Number.isFinite(given.max)) settled.max = given.max;
  if (Array.isArray(given.range)) settled.range = given.range;
  if (given.unit) settled.unit = given.unit;

  return settled;
};

const toBounds = (settled) => {
  if (Array.isArray(settled.domain)) return settled.domain;

  const lowest = Number.isFinite(settled.min) ? settled.min : null;
  const highest = Number.isFinite(settled.max) ? settled.max : null;

  return lowest === null && highest === null ? null : [lowest, highest];
};

const generateLineChart = (settings, size, padding) => {
  const { left_keys, left_key, bottom_key, timestamp_key, right_key, scale_type, data, domains, colors, color_key, zoom_x, zoom_y, start, end, domain_padding, axis } = settings;

  const left_axis = toAxis(axis, 'left', { key: left_key, zoom: zoom_y, domain: toRange(domains && domains.left), unit: toUnit(domains && domains.left) });
  const right_axis = toAxis(axis, 'right', { key: right_key, zoom: zoom_y, domain: toRange(domains && domains.right), unit: toUnit(domains && domains.right) });
  const bottom_axis = toAxis(axis, 'bottom', { key: timestamp_key || bottom_key, zoom: zoom_x, scale_type: scale_type || (timestamp_key ? 'time' : 'point'), domain: toRange(domains && domains.bottom), unit: toUnit(domains && domains.bottom) });

  const width = size.width - padding * 2;
  const height = size.height - padding * 2;
  if (width <= 0 || height <= 0) return null;

  const is_time = bottom_axis.scale_type === 'time';
  const rows = toSorted(data, is_time ? bottom_axis.key : '');
  if (!rows.length) return null;

  const right_gutter = right_axis.key ? RIGHT_GUTTER : padding;
  const plot_left = padding + LEFT_GUTTER;
  const plot_right = size.width - padding - right_gutter;
  const plot_top = padding + TOP_GUTTER;
  const plot_bottom = size.height - padding - BOTTOM_GUTTER;
  const plot_width = plot_right - plot_left;
  const plot_height = plot_bottom - plot_top;
  if (plot_width <= 0 || plot_height <= 0) return null;

  const from_moment = toMoment(start);
  const to_moment = toMoment(end);
  const held = from_moment !== null && to_moment !== null && !zoom_x;

  const spread = Array.isArray(bottom_axis.range) ? bottom_axis.range : [plot_left, plot_right];

  const toBottomDomain = () => {
    const bounds = toBounds(bottom_axis);
    if (held && !bottom_axis.zoom) return [new Date(from_moment), new Date(to_moment)];
    if (bounds) return bounds;

    return [new Date(rows[0][bottom_axis.key]), new Date(rows[rows.length - 1][bottom_axis.key])];
  };

  const along = is_time
    ? d3.scaleTime().domain(toBottomDomain()).range(spread)
    : d3.scalePoint().domain(rows.map((row) => String(row[bottom_axis.key]))).range(spread);

  const left_unit = left_axis.unit || '';
  const right_unit = right_axis.unit || '';
  const bottom_unit = bottom_axis.unit || '';

  const rise = (settled) => (Array.isArray(settled.range) ? settled.range : [plot_bottom, plot_top]);

  const left_extent = toExtent(rows, left_keys.length ? left_keys[0] : left_axis.key, toBounds(left_axis), left_axis.zoom, domain_padding);
  const up = d3.scaleLinear().domain(left_extent).range(rise(left_axis));

  const right_extent = right_axis.key ? toExtent(rows, right_axis.key, toBounds(right_axis), right_axis.zoom, domain_padding) : null;
  const up_right = right_axis.key ? d3.scaleLinear().domain(right_extent).range(rise(right_axis)) : null;

  const at = (row) => (is_time ? along(new Date(row[bottom_axis.key])) : along(String(row[bottom_axis.key])));

  const toLine = (key, scale) => {
    const points = rows
      .filter((row) => Number.isFinite(Number(row[key])))
      .map((row) => at(row).toFixed(2) + ',' + scale(Number(row[key])).toFixed(2));

    return points.length ? 'M' + points.join('L') : '';
  };

  const toColor = (key) => {
    const carried = rows.find((row) => row.color);
    if (colors && colors[key]) return colors[key];
    if (carried) return carried.color;
    if (colors && color_key && colors[rows[0][color_key]]) return colors[rows[0][color_key]];

    return DEFAULT_COLOR;
  };

  const lines = left_keys.length
    ? left_keys.map((key) => ({ key, color: toColor(key), d: toLine(key, up) }))
    : [{ key: left_key, color: toColor(left_key), d: toLine(left_key, up) }];

  if (right_axis.key) lines.push({ key: right_axis.key, color: toColor(right_axis.key), d: toLine(right_axis.key, up_right) });

  const rules = [];

  for (let step = 0; step <= GRID_STEPS; step += 1) {
    const y = plot_bottom - (plot_height * step) / GRID_STEPS;

    rules.push({
      y: y.toFixed(2),
      unit_y: (y + 11).toFixed(2),
      d: 'M' + plot_left.toFixed(2) + ',' + y.toFixed(2) + 'L' + plot_right.toFixed(2) + ',' + y.toFixed(2),
      left: formatNumbers(up.invert(y)),
      right: up_right ? formatNumbers(up_right.invert(y)) : '',
    });
  }

  const ticks = is_time
    ? along.ticks(Math.min(rows.length, 6)).map((moment) => ({ x: along(moment).toFixed(2), label: d3.timeFormat('%H:%M')(moment) }))
    : along.domain().map((name) => ({ x: along(name).toFixed(2), label: name }));

  return {
    lines,
    rules,
    ticks,
    left_unit,
    right_unit,
    bottom_unit,
    plot_left: plot_left.toFixed(2),
    plot_right: plot_right.toFixed(2),
    plot_bottom: plot_bottom.toFixed(2),
    label_y: (plot_bottom + 18).toFixed(2),
    unit_label_y: (plot_bottom + 28).toFixed(2),
    has_right: Boolean(right_axis.key),
  };
};
