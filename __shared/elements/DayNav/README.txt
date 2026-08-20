DayNav — seven equal cells, one pressed in.

DOM CONTRACT
  <div class="day-nav grid">
    <button class="button-main day-nav-day quiet square">M<small>18</small></button>
  </div>

  No atom on the container: the row itself is not a surface, only the cells are.
  An element is allowed to be pure layout.

  Selected presses IN rather than rising out, which is the opposite of TabNav.
  A day is a place you have gone to; a tab is a thing you have picked up. The
  material can say both, and it should say them differently.

KEYS
  items       DatedItem rows: label (the letter), name (the date), when
  selected    which id is chosen
  handleSelect fires with the chosen value
