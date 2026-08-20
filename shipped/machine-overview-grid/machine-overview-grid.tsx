import './styles.css';

export type MachineOverviewGridProps = {
  data?: Record<string, unknown>[];
  className?: string;
  icon?: string;
  color?: string;
  title?: string;
  value?: string;
};

export function MachineOverviewGrid({
  data = [],
  className,
  icon = '',
  color = '',
  title = '',
  value = '',
}: MachineOverviewGridProps) {
  return (
    <>
      <div className="machine-overview-grid">
        <div data-area="icon"><img alt="" /></div>
        <header data-area="header">
          <div className="title"></div>
          <div className="value"></div>
        </header>
        <div data-area="spacer"></div>
        <div data-area="main" className="machine-overview-details">
          <div className="cell name heading"></div>
          <div className="cell target heading">Target</div>
          <div className="cell actual heading">Actual Value</div>
        </div>
      </div>
    </>
  );
}

export default MachineOverviewGrid;
