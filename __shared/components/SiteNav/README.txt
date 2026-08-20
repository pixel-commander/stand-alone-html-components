SiteNav — the app's own list of places.

DOM CONTRACT
  <nav class="site-nav grid">
    <button class="button-main site-nav-item quiet square grid is-active">
      <svg/><span>Today</span><span class="site-nav-count">6</span>
    </button>
  </nav>

  Three tracks: glyph, label, count. The count keeps its column even when empty,
  so the labels of every item line up and the list reads as a column instead of
  a ragged stack.

CURRENT PRESSES IN
  The active item is sunken, matching DayNav: where you ARE is pressed in,
  what you PICKED is raised. One rule across the whole system.

STATE
  This is real app navigation, so it goes through useURL — never local state.
  A click is go('update-path', { page:'projects' }), and naming a segment clears
  everything deeper, which is what stops a stale tab riding into a page that
  has no such tab.

KEYS
  items / selected / handleSelect
  nav          the GridAreaProps slot this usually fills
  slug / path  UseURLProps, when the item maps to a url segment
