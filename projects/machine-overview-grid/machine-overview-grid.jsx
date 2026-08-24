const CELL = 'cell px-3 py-1 text-center';
const HEADING = 'heading text-[#6f7276] text-[12px] font-normal border-b border-[#e0e0e0]';

const MachineOverviewGrid = ({ data = [], icon = '', color = '', title = '', value = '', className = '' }) => {
  return (
    <div className={'machine-overview-grid grid grid-cols-[30px_1fr] grid-rows-[auto_1fr] items-start gap-x-2 p-2 box-border ' + className}>
      <div className="icon grid place-items-center w-[30px] h-[30px] rounded-full row-start-1 col-start-1" style={{ background: color }}>
        {icon && <img className="block w-[18px] h-[18px]" src={icon} alt="" />}
      </div>

      <header className="grid grid-cols-[1fr_auto] items-end gap-3 min-h-[30px] font-semibold row-start-1 col-start-2">
        <div className="title translate-y-[20%]">{title}</div>
        <div className="value text-[18px] font-semibold">{value}</div>
      </header>

      <div className="machine-overview-details grid grid-cols-[1fr_auto_auto] content-start box-border row-start-2 col-start-2">
        <div className={CELL + ' name pl-0 text-left ' + HEADING} />
        <div className={CELL + ' target ' + HEADING}>Target</div>
        <div className={CELL + ' actual pr-0 text-right ' + HEADING}>Actual Value</div>

        {data.map((row) => (
          <React.Fragment key={row.name}>
            <div className={CELL + ' name pl-0 text-left'}>{row.name}</div>
            <div className={CELL + ' target'}>{row.target}</div>
            <div className={CELL + ' actual pr-0 text-right font-semibold'}>{row.actual}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
