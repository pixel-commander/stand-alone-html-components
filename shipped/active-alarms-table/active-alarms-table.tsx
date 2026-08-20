import './styles.css';

export type ActiveAlarmsTableProps = {
  data?: Record<string, unknown>[];
  className?: string;
  handleClick?: ((...args: never[]) => void) | null;
  Icon?: string;
  link_text?: string;
};

export function ActiveAlarmsTable({
  data = [],
  className,
  handleClick = undefined,
  Icon = 'icons/bell.svg',
  link_text = 'Open Issue',
}: ActiveAlarmsTableProps) {
  return (
    <>
      <div className="active-alarms-table">
        <ul className="inner"></ul>
      </div>
    </>
  );
}

export default ActiveAlarmsTable;
