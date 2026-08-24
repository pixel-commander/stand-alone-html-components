const HOVERED_RATIO = 1.015;
const NOT_HOVERED_RATIO = 0.985;

const generatePieChart = (data, donut, size, padding, inner_radius) => {
  const total = data.reduce((sum, row) => sum + (row.value || 0), 0);
  if (!total) return [];

  const width = size.width - padding * 2;
  const height = size.height - padding * 2;
  const span = Math.min(width, height);
  if (span <= 0) return [];

  const center_x = size.width / 2;
  const center_y = size.height / 2;
  const outer = span / 2 / HOVERED_RATIO;
  const inner = donut ? outer * inner_radius : 0;

  let angle = -Math.PI / 2;

  return data.map((row) => {
    const sweep = ((row.value || 0) / total) * Math.PI * 2;
    const end = angle + sweep;
    const large_arc = sweep > Math.PI ? 1 : 0;

    const toPath = (rim, hole) => {
      const outer_from_x = (center_x + rim * Math.cos(angle)).toFixed(2);
      const outer_from_y = (center_y + rim * Math.sin(angle)).toFixed(2);
      const outer_to_x = (center_x + rim * Math.cos(end)).toFixed(2);
      const outer_to_y = (center_y + rim * Math.sin(end)).toFixed(2);
      const outer_arc = 'A' + rim.toFixed(2) + ',' + rim.toFixed(2) + ' 0 ' + large_arc + ' 1 ' + outer_to_x + ',' + outer_to_y;

      if (!donut) {
        return 'M' + center_x.toFixed(2) + ',' + center_y.toFixed(2) + 'L' + outer_from_x + ',' + outer_from_y + outer_arc + 'Z';
      }

      const inner_from_x = (center_x + hole * Math.cos(angle)).toFixed(2);
      const inner_from_y = (center_y + hole * Math.sin(angle)).toFixed(2);
      const inner_to_x = (center_x + hole * Math.cos(end)).toFixed(2);
      const inner_to_y = (center_y + hole * Math.sin(end)).toFixed(2);
      const inner_arc = 'A' + hole.toFixed(2) + ',' + hole.toFixed(2) + ' 0 ' + large_arc + ' 0 ' + inner_from_x + ',' + inner_from_y;

      return 'M' + outer_from_x + ',' + outer_from_y + outer_arc + 'L' + inner_to_x + ',' + inner_to_y + inner_arc + 'Z';
    };

    const slice = {
      group: row.group,
      color: row.color,
      d: toPath(outer, inner),
      d_hovered: toPath(outer * HOVERED_RATIO, inner * NOT_HOVERED_RATIO),
      d_not_hovered: toPath(outer * NOT_HOVERED_RATIO, inner * HOVERED_RATIO),
    };

    angle = end;

    return slice;
  });
};
