const UNITS = [
  { at: 1e9, suffix: 'B' },
  { at: 1e6, suffix: 'M' },
  { at: 1e3, suffix: 'K' },
];

const toTrimmed = (value) => {
  const shown = value.toFixed(1);

  return shown.endsWith('.0') ? shown.slice(0, -2) : shown;
};

const formatNumbers = (number) => {
  const value = Number(number);
  if (!Number.isFinite(value)) return '';

  const sign = value < 0 ? '-' : '';
  const size = Math.abs(value);

  const unit = UNITS.find((one) => size >= one.at);
  if (unit) return sign + toTrimmed(size / unit.at) + unit.suffix;

  if (size < 1 && size > 0) return sign + toTrimmed(size).replace('0.', '.');

  return sign + toTrimmed(size);
};
