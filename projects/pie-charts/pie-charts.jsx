const PieCharts = ({
  data = [],
  donut = true,
  padding = 5,
  inner_radius = 0.6,
  unit = '',
  show_values = false,
  handleClick = null,
  className = '',
}) => {
  const holder = React.useRef(null);
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const [selected, setSelected] = React.useState(null);
  const [hovered, setHovered] = React.useState(null);

  React.useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const box = entries[0] && entries[0].contentRect;
      if (box) setSize({ width: box.width, height: box.height });
    });

    if (holder.current) observer.observe(holder.current);

    return () => observer.disconnect();
  }, []);

  const slices = generatePieChart(data, donut, size, padding, inner_radius);
  const chosen = hovered === null ? selected : hovered;
  const total = data.reduce((sum, row) => sum + (row.value || 0), 0);
  const item = selected === null ? null : data[selected];

  const onClickSlice = (index) => {
    setSelected(selected === index ? null : index);
    if (handleClick) handleClick(data[index]);
  };

  return (
    <div ref={holder} className={'chart-container pie-chart-container grid relative w-full h-full min-w-0 min-h-0 [container-type:inline-size] ' + className}>
      <svg data-id="pie chart" className="chart pie-chart w-full h-full" viewBox={'0 0 ' + size.width + ' ' + size.height}>
        {slices.map((slice, index) => (
          <path
            key={slice.group}
            className={'pie-slice' + (selected !== null && selected !== index ? ' is-not-selected' : '')}
            data-group={slice.group}
            fill={slice.color}
            d={chosen === null ? slice.d : chosen === index ? slice.d_hovered : slice.d_not_hovered}
            onClick={() => onClickSlice(index)}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
      </svg>

      {show_values && (
        <div className="values col-start-1 row-start-1 absolute inset-0 grid place-content-center w-[30cqw] mx-auto text-center pointer-events-none">
          <div className="pie-inner-title">{item ? item.group : ''}</div>
          <div className="pie-inner-value">{(item ? item.value : total) + unit}</div>
          <div className="pie-inner-label">{item ? 'amount' : 'total'}</div>
        </div>
      )}
    </div>
  );
};
