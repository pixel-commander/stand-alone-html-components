const ColoredStateTiles = ({ data = [], className = '' }) => {
  return (
    <div className={'colored-state-tiles flex flex-wrap justify-center gap-y-4 gap-x-8 p-4 box-border ' + className}>
      {data.map((row) => (
        <div className="colored-state-tile grid grid-rows-[auto_auto] w-max text-center" key={row.label}>
          <div className="title font-semibold" style={{ color: row.color }}>
            {row.title} ({row.value})
          </div>
          <div className="label text-[#6f7276] text-[12px]">{row.label}</div>
        </div>
      ))}
    </div>
  );
};
