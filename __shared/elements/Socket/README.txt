Socket — a plate with a hole cut in it, and optionally something seated there.

DOM CONTRACT
  <div class="container-socket plate round socket">
    <div class="container-socket round socket-cup">
      <div class="container-domed round socket-face"></div>
    </div>
  </div>

  Three nesting levels, each one an atom plus a layout class. The third is
  optional — a bare cup is a hole, and a hole is often the whole point.

WHAT MAKES THE CUP DIFFERENT FROM container-sunken
  Every other recess we own is DIRECTIONAL: a dark wall up-left, a lit floor
  down-right, because a light is somewhere. The cup has no direction at all —
  four inset shadows at zero offset and shrinking blur, stacked, so the darkness
  is a RING that hugs the edge evenly the whole way round.

  That reads as a bore rather than a dent. A dent implies a soft surface that got
  pushed; a bore implies a hard surface that got cut. It is the difference
  between a cushion and a machined aluminium panel, and it is entirely in the
  offsets being zero.

  The one directional layer left is the widest and faintest — a 40px inner
  smudge from the upper left at 5% — which keeps it from looking like a printed
  circle. Take it out and the cup goes flat.

THE PLATE IS LIT FROM BOTH SIDES
  .plate has no dark outer shadow at all: light above at 90%, light below at 45%,
  and only faint insets. Nothing in the library does that either. It reads as a
  lens or a bezel — a thing sitting IN a surface flush, rather than on top of it.
  Put a normal container-raised next to it and the plate looks machined into the
  page while the other sits on the page.

MODIFIERS
  plate    the outer bezel treatment (light both sides, no cast)
  shallow  two layers instead of five — a seam, for small controls
  hard     deeper and tighter, for a cup that holds something heavy
  round / pill / base   the radius, since a bore is usually circular

SIZES
  small / large / flat. flat turns the cup into a trough that runs the width of
  the plate, which is where seated content goes — a readout, a value, a label.

WHY THIS IS AN ELEMENT AND NOT ONE ATOM
  The look needs two surfaces at different depths. One element cannot carry two
  box-shadow stacks, and faking it with a pseudo-element would put layout inside
  a skin. Two divs, two atoms, one element that owns only the sizes.
