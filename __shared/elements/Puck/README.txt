Puck — a circle floating over a dark well.

The StyleToggle's material again, but the knob is no longer captive in a track:
the well has ordinary rounded corners and the circle sits above it rather than
inside it.

DOM CONTRACT
  <div class="container-carved puck grid">
    <div class="container-domed puck-face round"></div>
  </div>

WHAT MAKES IT FLOAT
  Two things, and only one of them is a shadow.

  The lift is a transform: translate(-.125rem,-.25rem) on the face. Up and very
  slightly left, matching where the light comes from. Its cast shadow does not
  move with it — box-shadow is drawn from the element's own box, so lifting the
  face slides it out from under its own shadow, and the gap that opens is what
  the eye reads as height. Two pixels of offset buys more altitude than any
  amount of blur.

  The well is DARKER than the surrounding surface, not the same. That is why the
  circle reads as being over the well instead of set into it: a recess and its
  contents share a colour, but a thing above a hole does not. container-carved
  fills with --bg-container-hard, the deepest step on the ladder.

  Corners are the ordinary --radius-md, so the well is a rounded rectangle
  rather than a capsule. A capsule implies a travel path and invites a drag;
  a rounded rectangle just holds.

is-active DROPS IT
  transform goes to none, so the face falls back onto its own shadow and the gap
  closes. It lands rather than dents — which is the right answer for something
  that was never in the hole to begin with.

FILLING THE WELL INSTEAD
  .puck.filled + .puck-face.fill drops the circle and lets the face take the
  whole well, keeping the well's 2rem of padding as the only inset. Corners go
  to --radius-md and the lift comes off.

  It stops being a puck and becomes a panel seated in a tray — which is the
  right shape when the face has to hold content. A circle can only hold a glyph.
  The material is identical either way; only the footprint changes.

MODIFIERS
  puck        filled (stretch the face) · start · end · snug · roomy
  puck-face   fill · small · large · seated (no lift) · is-active (dropped)

KEYS
  children / main   what goes on the face
  container_class   the well's skin
  item_class        the face's skin
  handleClick       if the face is pressable
  is_active         arrives as is-active
