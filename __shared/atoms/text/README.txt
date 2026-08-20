text — the two ink skins. Colour and shadow only, never a font-size.

An atom is a skin, and ink is a surface like any other: these set what the
glyphs are made of and leave every element's type scale alone. Wear one on
anything that already has a size from its element or from the ui-* classes.

text-carved
  A bevel, done with text-shadow: a dark hairline above the glyph and a light
  one below. Identical logic to container-carved's rim — the dark line is the
  wall you cannot see, the light line is the lip catching light. Modifiers:
  deep (adds a blurred cast), raised (flips the pair, so the text stands off the
  surface instead of into it), quiet (one line, muted ink, for labels).

text-domed
  The container-domed surface, painted into the glyphs. text-shadow cannot hold
  a gradient, so this uses background-clip:text with the same two radial pools
  the face uses, plus the bevel on top. Modifiers: bulge (the inflated pair),
  flat (gradient only, no bevel).

  THE COST, and it is real. background-clip:text needs the text itself to be
  transparent, so every bit of contrast now comes out of the gradient. That
  means it is only safe on a large heading over a surface you control — the
  puck face, a dome, a hero figure. It is never safe on body copy, and it is
  wrapped in @supports plus a forced-colors override that puts the solid ink
  back, because in high-contrast mode a transparent glyph is an invisible one.

WHY NEITHER GOES BELOW ABOUT 14px
  A .0625rem bevel against a 12px stroke is a third of the stroke's weight. The
  glyph stops reading as lettering with an edge and starts reading as lettering
  that is out of focus. Above --text-xl it is a bevel; below --text-lg it is a
  blur. The demos ship the too-small case on purpose so the line is visible.
