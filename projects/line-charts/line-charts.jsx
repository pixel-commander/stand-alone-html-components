const LineCharts = ({
  left_keys = [],
  left_key = '',
  bottom_key = '',
  timestamp_key = '',
  right_key = '',
  scale_type = '',
  data = [],
  domains = null,
  colors = null,
  color_key = '',
  zoom_x = true,
  zoom_y = true,
  start = null,
  end = null,
  domain_padding = true,
  axis = null,
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

  const chart = generateLineChart(
    { left_keys, left_key, bottom_key, timestamp_key, right_key, scale_type, data, domains, colors, color_key, zoom_x, zoom_y, start, end, domain_padding, axis },
    size,
    padding
  );

  return (
    <div ref={holder} className={'chart-container line-chart-container grid relative w-full h-full min-w-0 min-h-0 [container-type:inline-size] ' + className}>
      <svg data-id="line chart" className="chart line-chart w-full h-full" viewBox={'0 0 ' + size.width + ' ' + size.height}>
        {chart && (
          <React.Fragment>
            {chart.rules.map((rule, index) => (
              <React.Fragment key={index}>
                <path className="line-rule" d={rule.d} />
                <text className="line-label" data-side="left" x={chart.plot_left} y={rule.y}>{rule.left}</text>
                {chart.left_unit && <text className="line-unit" data-side="left" x={chart.plot_left} y={rule.unit_y}>{chart.left_unit}</text>}
                {chart.has_right && <text className="line-label" data-side="right" x={chart.plot_right} y={rule.y}>{rule.right}</text>}
                {chart.has_right && chart.right_unit && <text className="line-unit" data-side="right" x={chart.plot_right} y={rule.unit_y}>{chart.right_unit}</text>}
              </React.Fragment>
            ))}

            {chart.ticks.map((tick, index) => (
              <React.Fragment key={index}>
                <text className="line-label" data-side="bottom" x={tick.x} y={chart.label_y}>{tick.label}</text>
                {chart.bottom_unit && <text className="line-unit" data-side="bottom" x={tick.x} y={chart.unit_label_y}>{chart.bottom_unit}</text>}
              </React.Fragment>
            ))}

            {chart.lines.filter((line) => line.d).map((line) => (
              <path className="line-series" key={line.key} data-key={line.key} stroke={line.color} d={line.d} />
            ))}
          </React.Fragment>
        )}
      </svg>
    </div>
  );
};
