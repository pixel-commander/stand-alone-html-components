const GaugeCharts = ({
  gauge_type = 'full',
  start_angle = null,
  end_angle = null,
  min = 0,
  max = 0,
  value = 0,
  color = '#4caf50',
  thresholds = [],
  colors = [],
  tick_count = 6,
  padding = 5,
  className = '',
}) => {
  const holder = React.useRef(null);
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const box = entries[0] && entries[0].contentRect;
      if (box) setSize({ width: box.width, height: box.height });
    });

    if (holder.current) observer.observe(holder.current);

    return () => observer.disconnect();
  }, []);

  const gauge = generateGaugeChart(
    { gauge_type, start_angle, end_angle, min, max, value, color, thresholds, colors, tick_count },
    size,
    padding
  );

  return (
    <div ref={holder} className={'chart-container gauge-chart-container grid relative w-full h-full min-w-0 min-h-0 [container-type:inline-size] ' + className}>
      <svg data-id="gauge chart" className="chart gauge-chart w-full h-full" viewBox={'0 0 ' + size.width + ' ' + size.height}>
        {gauge && (
          <React.Fragment>
            <path className="gauge-track" d={gauge.track} />

            {gauge.bands.map((band, index) => (
              <path className="gauge-band" key={index} fill={band.color} d={band.d} />
            ))}

            {gauge.ticks.map((tick, index) => (
              <React.Fragment key={index}>
                <path className="gauge-tick" d={tick.d} />
                <text className="gauge-label" x={tick.x} y={tick.y}>{tick.label}</text>
              </React.Fragment>
            ))}

            {gauge.needle && <path className="gauge-needle" d={gauge.needle} />}

            <circle className="gauge-pivot" cx={gauge.center_x} cy={gauge.center_y} r={gauge.pivot} />
          </React.Fragment>
        )}
      </svg>
    </div>
  );
};
