const COMPONENT = document.querySelector('line-charts');

const STARTED = new Date('2026-08-20T06:00:00');
const READINGS = [];

for (let step = 0; step < 24; step += 1) {
  READINGS.push({
    at: new Date(STARTED.getTime() + step * 15 * 60 * 1000).toISOString(),
    line: 'line one',
    throughput: 40 + Math.round(Math.sin(step / 3) * 18) + step,
    temperature: 62 + Math.round(Math.cos(step / 4) * 6),
  });
}

COMPONENT.data = READINGS;
COMPONENT.timestamp_key = 'at';
COMPONENT.left_key = 'throughput';
COMPONENT.right_key = 'temperature';
COMPONENT.color_key = 'line';
COMPONENT.colors = { 'line one': '#1e88e5', temperature: '#e53935' };
