IconButton — a square or round Button with a glyph instead of a label.

DOM CONTRACT
  <button class="button-main icon-button square" aria-label="New"><svg/></button>

  The label key becomes aria-label, not visible text. An icon-only control with
  no aria-label is a bug, not a style choice.

WHY A SEPARATE ELEMENT AND NOT A Button MODIFIER
  Button sizes itself from its text; this one is a fixed square that must stay
  square at every step of the viewport clamp. Two different sizing rules, so
  two elements. They share the same atom, so they are the same material.

KEYS
  label       the accessible name
  name        which glyph — the caller passes the svg as children
  handleClick the house handler word
