const CELL = 'py-1.5 border-t border-[#e0e0e0]';

const StyledDl = ({ data = [], className = '' }) => {
  return (
    <div className={'styled-dl min-h-0 overflow-auto ' + className}>
      <dl className="pr-2 grid grid-cols-[auto_auto] m-0">
        {data.map((row, index) => (
          <React.Fragment key={row.label}>
            <dt className={'label-cell ' + CELL + (index === 0 ? ' border-t-0' : '')}>{row.label}</dt>
            <dd className={'value-cell m-0 text-right ' + CELL + (index === 0 ? ' border-t-0' : '')}>{row.value}</dd>
          </React.Fragment>
        ))}
      </dl>
    </div>
  );
};
