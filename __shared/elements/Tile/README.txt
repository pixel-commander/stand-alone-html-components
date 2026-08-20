Tile — an element that wears atoms AND other elements.

DOM CONTRACT
  <button class="button-main tile grid side-l pill">
    <div data-area="side">…an Avatar…</div>
    <div data-area="main">…title…</div>
  </button>

  This is the composition case worth reading. The layout is not invented: side-l
  and come from HOUSE_CSS grid.css, and the slots are the keyring's own
  `left` and `main` from GridAreaProps. The tile's own css adds min-height,
  padding and type — nothing else.

  So an element that needs a two-slot row does not write a template. It names
  a house grid and fills the areas.

KEYS
  title / description   rendered
  side / main           GridAreaProps slots — whatever the caller puts there.
                        side-l's areas are "side main", so the slot word is
                        `side`. `left` belongs to .grid.sides, which is the
                        three-track template.
  handleClick           the house handler word
  is_selected           arrives as is-selected
