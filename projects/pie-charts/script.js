const DATA = [
  { group: 'Running', value: 62, color: '#4caf50' },
  { group: 'Idle', value: 24, color: '#ffb300' },
  { group: 'Fault', value: 14, color: '#e53935' },
];

ReactDOM.createRoot(document.getElementById('root')).render(
  <PieCharts data={DATA} unit="%" show_values handleClick={(item) => console.log(item.group, item.value)} />
);
