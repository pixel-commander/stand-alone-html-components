StressTest — the same atom on three backgrounds.

WHAT IT PROVES
  The ramps are alpha over --shadow-rgb and --highlight-rgb, so they composite
  with whatever is behind them. Move the shape onto a different tint, or onto a
  gradient, and it still reads as the same material.

  The alternative spec — two opaque colours sampled from the surface's darker
  and lighter neighbours — looks identical on its own background and only there.
  It cannot composite, because there is no alpha to composite with: it paints
  over the background, so off its one surface it becomes a grey halo.

WHY IT IS IN THE GUIDE AND NOT IN A DOC
  It is the argument for the whole token layer, and it is only convincing when
  you can see the middle plate. A team that has seen this does not "just use a
  hex" six months later.

  The busy plate's gradient is written literally in this component's own css.
  It is deliberately off-palette — a background nobody designed for — which is
  the point of the test.
