const FULL_START = -225;
const FULL_END = 45;
const HALF_START = -180;
const HALF_END = 0;
const TAIL_RATIO = 0.12;
const TICK_RATIO = 0.07;
const LABEL_RATIO = 0.16;

const toRadians = (degrees) => (degrees * Math.PI) / 180;

const generateGaugeChart = (settings, size, padding) => {
  const { gauge_type, start_angle, end_angle, min, max, value, color, thresholds, colors, tick_count } = settings;

  const width = size.width - padding * 2;
  const height = size.height - padding * 2;
  const span = Math.min(width, height);
  if (span <= 0) return null;

  const preset_start = gauge_type === 'half' ? HALF_START : FULL_START;
  const preset_end = gauge_type === 'half' ? HALF_END : FULL_END;
  const from = Number.isFinite(start_angle) ? start_angle : preset_start;
  const to = Number.isFinite(end_angle) ? end_angle : preset_end;

  const center_x = size.width / 2;
  const center_y = size.height / 2;
  const outer = span / 2;
  const inner = outer * 0.72;
  const range = max - min;

  const pointAt = (radius, degrees) => {
    const radians = toRadians(degrees);
    return [center_x + radius * Math.cos(radians), center_y + radius * Math.sin(radians)];
  };

  const angleFor = (at) => {
    if (range <= 0) return from;
    const share = (Math.min(Math.max(at, min), max) - min) / range;
    return from + share * (to - from);
  };

  const toBand = (from_angle, to_angle) => {
    const [outer_from_x, outer_from_y] = pointAt(outer, from_angle);
    const [outer_to_x, outer_to_y] = pointAt(outer, to_angle);
    const [inner_from_x, inner_from_y] = pointAt(inner, from_angle);
    const [inner_to_x, inner_to_y] = pointAt(inner, to_angle);
    const large_arc = Math.abs(to_angle - from_angle) > 180 ? 1 : 0;

    return 'M' + outer_from_x.toFixed(2) + ',' + outer_from_y.toFixed(2) +
      'A' + outer.toFixed(2) + ',' + outer.toFixed(2) + ' 0 ' + large_arc + ' 1 ' + outer_to_x.toFixed(2) + ',' + outer_to_y.toFixed(2) +
      'L' + inner_to_x.toFixed(2) + ',' + inner_to_y.toFixed(2) +
      'A' + inner.toFixed(2) + ',' + inner.toFixed(2) + ' 0 ' + large_arc + ' 0 ' + inner_from_x.toFixed(2) + ',' + inner_from_y.toFixed(2) + 'Z';
  };

  const track = toBand(from, to);

  const bands = [];

  if (thresholds.length && thresholds.length === colors.length) {
    let lower = min;

    thresholds.forEach((upper, index) => {
      bands.push({ color: colors[index], d: toBand(angleFor(lower), angleFor(upper)) });
      lower = upper;
    });
  } else {
    bands.push({ color: color, d: toBand(from, to) });
  }

  const ticks = [];
  const steps = Math.max(tick_count - 1, 1);

  for (let step = 0; step <= steps; step += 1) {
    const at = range <= 0 ? min : min + (range * step) / steps;
    const degrees = angleFor(at);
    const [from_x, from_y] = pointAt(inner, degrees);
    const [to_x, to_y] = pointAt(inner - outer * TICK_RATIO, degrees);
    const [label_x, label_y] = pointAt(inner - outer * LABEL_RATIO, degrees);

    ticks.push({
      label: String(Math.round(at)),
      d: 'M' + from_x.toFixed(2) + ',' + from_y.toFixed(2) + 'L' + to_x.toFixed(2) + ',' + to_y.toFixed(2),
      x: label_x.toFixed(2),
      y: label_y.toFixed(2),
    });

    if (tick_count <= 1) break;
  }

  const needle_angle = angleFor(value);
  const [head_x, head_y] = pointAt(inner - outer * TICK_RATIO, needle_angle);
  const [tail_x, tail_y] = pointAt(-outer * TAIL_RATIO, needle_angle);

  return {
    track,
    bands,
    ticks,
    center_x: center_x.toFixed(2),
    center_y: center_y.toFixed(2),
    pivot: (outer * 0.05).toFixed(2),
    needle: range <= 0 ? '' : 'M' + tail_x.toFixed(2) + ',' + tail_y.toFixed(2) + 'L' + head_x.toFixed(2) + ',' + head_y.toFixed(2),
  };
};
