containers — the surfaces. Four atoms, and one distinction worth reading.

TWO KINDS OF SHADOW, ON PURPOSE

  THE BLOCK DROP — container-raised and container-sunken with no modifier.
  Two layers, big offsets, big blur: 1.75rem out at 3.125rem of blur in
  --shadow-block-rgb at 16%, answered by a single hard highlight up-left. This
  is a page block casting a shadow into the room. It is for the shell, a
  section frame, a full-width panel — anything large enough that the eye reads
  it as a separate plate sitting above the page.

  THE SURFACE FAMILY — .mid and .tight. Six layers each in --shadow-rgb at
  three to six percent, reaching 1.75rem and .75rem. This is not a cast shadow,
  it is relief: the surface itself swelling or denting. It is for cards, rows,
  buttons, switches, checkboxes.

  They are different because they are describing different physics, and using
  the wrong one is instantly visible. The block drop on a checkbox is a smear
  with no edge. The surface family on a 60rem panel is cardboard — flat, with a
  faint line where an edge should be.

  .soft is the third option: the eight-layer diffuse ramp at block scale, for
  when a large surface should melt into the page instead of sitting above it.

MODIFIERS
  (none)  the block drop      big page blocks, frames, shells
  soft    diffuse at reach    large surfaces that recede
  mid     six layers, 1.75rem cards, rows, panels inside a frame
  tight   six layers, .75rem  buttons, chips, controls, handles
  pill / round                the radius specials
  deep                        a darker fill in the recess (sunken only)

STATES
  is-active and is-selected invert the ramp at whatever compression the atom is
  wearing, so a pressed thing presses in at its own scale.

container-carved — FLAT, WITH TWO HAIRLINES
  The base is a flat darker fill and three one-pixel lines: a dark line inside
  the top edge, a light line inside the bottom, a light line outside the bottom.
  No blur, no wash, no gradient. It is a panel that happens to be inset, not a
  pit.

  Why so little: the whole point of this surface is that something sits ON it,
  and every bit of blur on the floor competes with the thing standing there. The
  two hairlines carry the entire read, because a hairline pair IS the language
  of an inset edge — the dark line is the wall you cannot see, the light line is
  the lip catching light. Depth is an edge phenomenon; the floor never needed
  to say anything.

  The depth ladder, in order:
    shallow   one dark hairline. A seam.
    (none)    flat plus both hairlines. The default.
    cut       adds a .25rem top shade. A tray.
    deep      adds a .5rem top shade. A channel.
    flooded   the original full-surface wash. Bottomless, and heavy — for when
              a recess should feel like a hole rather than a panel.

container-domed — TWO POOLS, NOT THREE
  The face is a flat fill plus two radial pools: a dark one low-right and a
  faint light one off the top-left corner. That is the whole surface.

  It replaced a three-pool stack (now .bulge) that put a bright highlight in the
  middle of the face. The bright centre is what made the old version read as a
  balloon — the lit spot sat where the surface is closest to you, so the face
  looked inflated rather than machined. Pulling the light out to the corner and
  letting the dark pool do the falloff gives a face that reads as slightly
  crowned and mostly flat, which is what a real key looks like.

  The cast shadow did not change. Only the surface did, so the face still sits
  as high as it did.

  .bulge keeps the inflated version. is-active shares this surface and swaps
  only the shadow, so pressing changes height and not material.
