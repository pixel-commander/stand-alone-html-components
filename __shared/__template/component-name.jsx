const ComponentName = ({ data = [], className = '' }) => {
  return (
    <div className={'component-name flex flex-col min-h-0 overflow-auto ' + className}>
      {data.map((row) => (
        <div className="flex flex-wrap gap-x-2" key={row.id}>
          <div className="flex-none whitespace-nowrap font-semibold">{row.id}</div>
        </div>
      ))}
    </div>
  );
};
