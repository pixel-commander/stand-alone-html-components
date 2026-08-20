Ring — a radial progress dial.

DOM CONTRACT
  <div class="container-sunken ring round mid" data-fill="62">
    <span class="ring-value">…</span>
  </div>

  The dial is a masked conic-gradient on ::after, so it needs no svg and no
  library, and it inherits the accent instead of naming a hue.

WHY THE RECESS
  A dial is a gauge cut into the surface. Raised, it reads as a knob you could
  turn, which is a promise this element does not keep.

KEYS
  value   0 to 100. js writes it to --fill; the number is data.
  label   what the dial measures
  title   the big centred figure, if it differs from value
