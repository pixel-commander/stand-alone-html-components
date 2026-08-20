StatRow — a name on the left, a figure on the right.

DOM CONTRACT
  <div class="stat-row grid">
    <span class="stat-row-name">Design</span>
    <span class="ui-hint">8 / 12</span>
  </div>

  minmax(0,1fr) auto, not space-between. The 1fr with a zeroed minimum is what
  stops a long name from pushing the figure off the edge — the track gives way
  instead of the layout.

KEYS
  name / title   the label
  value          the figure
  right          a slot, when the figure is a Switch or a Track instead of text
