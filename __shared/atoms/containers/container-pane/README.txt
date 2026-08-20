container-pane — a container with no surface of its own.

WHAT MAKES IT DIFFERENT FROM EVERY OTHER CONTAINER WE HAVE
  It has no fill. background-color is transparent, so whatever is behind it
  shows through — the page gradient, another panel, an image. What defines the
  edge is a one-pixel hairline at 20% highlight, and what gives it depth is the
  shadow pair alone.

  Every other container atom paints a fill and therefore has to sit on a
  background close enough to its own colour that the shadow reads. A pane does
  not care what it lands on. That makes it the only container in the set that is
  safe over a gradient or a photo, which is exactly the portability argument the
  original spec sheet made about tinted-alpha shadows — the same lesson, one
  level up.

  It also means a pane never hides what it covers, so nesting panes reads as
  layers of glass rather than a stack of cards.

THE THREE STATES ARE THE POINT
  base        outer pair only. Lifted.
  inset       inner pair only. Recessed.
  is-active   BOTH pairs at once, plus a diagonal wash.

  That third one is the interesting one. Outer and inner together says the plate
  is raised AND has a bevelled inner lip — which is a real object, not a
  contradiction: a machined bezel. It makes a far better "selected" than a
  colour change does, because it reads at any accent and in both themes.

  hover on the base adds the inner pair on its own, so hovering previews the
  selected state. That is deliberate and it is why the transition is on
  box-shadow — the lip grows inward rather than the card jumping.

MODIFIERS
  tight  small controls, 3px offsets
  wide   big panels, 16px offsets
  edge   hairline only, no shadow at all — a boundary, not a plate
  wash   the diagonal gradient without the doubled shadow

  is-disabled drops the shadow and takes the hairline to 10%.

THE HAIRLINE IS NOT A BORDER IN THE USUAL SENSE
  It is a highlight, drawn as a border because a border is the only way to get a
  one-pixel line on all four sides that follows the radius. It uses the theme's
  highlight colour, not a border colour, so it stays part of the light model.
  If you need a real border, that is --color-border and a different atom.

EVERY MODIFIER STATES ITS OWN HOVER, AND IT HAS TO
  .container-pane:hover and .container-pane.inset both weigh 0,2,0, and the
  hover rule is written later, so without its own hover rule an inset pane
  would take the base treatment — outer pair and all — the moment you point at
  it. So inset, edge and is-disabled each restate their hover value.

  box-shadow:inherit does NOT work here and is a trap worth naming: box-shadow
  is not an inherited property, so inherit does not mean "leave mine alone", it
  means "copy my parent's". Since almost everything in this system sits inside a
  shadowed container, that paints the parent's entire shadow stack onto the pane.
  If you ever need "no change on hover", write the value out or write none.

  is-disabled gets a :hover twin for the same reason — a disabled pane that
  lights up on hover is a lie about whether it can be clicked.
