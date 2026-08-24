ReactDOM.createRoot(document.getElementById('root')).render(
  <GaugeCharts
    min={0}
    max={120}
    value={78}
    tick_count={6}
    thresholds={[60, 100, 120]}
    colors={['#4caf50', '#ffb300', '#e53935']}
  />
);
