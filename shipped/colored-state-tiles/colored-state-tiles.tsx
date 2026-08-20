import './styles.css';

export type ColoredStateTilesProps = {
  data?: Record<string, unknown>[];
  className?: string;
};

export function ColoredStateTiles({
  data = [],
  className,
}: ColoredStateTilesProps) {
  return (
    <>
      <div className="colored-state-tiles">
      </div>
    </>
  );
}

export default ColoredStateTiles;
