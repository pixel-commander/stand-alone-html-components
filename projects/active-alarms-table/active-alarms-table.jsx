const ActiveAlarmsTable = ({ data = [], Icon = 'icons/bell.svg', link_text = 'Open Issue', handleClick = null, className = '' }) => {
  return (
    <div className={'active-alarms-table flex min-h-0 ' + className}>
      <ul className="inner flex-auto list-none m-0 p-0 min-h-0 overflow-auto">
        {data.map((row, index) => (
          <li className="flex flex-wrap gap-x-2" key={index}>
            <img className="icon flex-none block w-4 h-4" src={Icon} alt="" />
            <div className="date flex-auto">{row.date}</div>
            {handleClick && (
              <a
                className="link flex-none text-[#005eb8] no-underline whitespace-nowrap"
                href="#"
                onClick={(event) => { event.preventDefault(); handleClick(row); }}
              >
                {link_text}
              </a>
            )}
            <div className="break basis-full h-0" />
            <div className="id flex-none whitespace-nowrap font-semibold">{row.id}</div>
            <div className="details flex-auto">{row.description}</div>
            <div className="spacer basis-full my-1.5 border-b border-[#e0e0e0]" />
          </li>
        ))}
      </ul>
    </div>
  );
};
