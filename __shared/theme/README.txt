HOUSE_THEME — the token layer, in two tiers.

  tier 1  THE THEME    palette, surfaces, borders, the two depth colours, the
                       typeface pair. A theme overrides these and nothing else.
  tier 2  THE SYSTEM   space, radius, type scale, border widths, timing. Shared
                       by every theme, because a theme is a change of colour and
                       material, not of rhythm.

theme.css        tier 2 plus the light values as the default, the accent-*
                 classes, and the element resets.
soft-light.css   .theme-soft-light — the daylight material.
soft-dark.css    .theme-soft-dark  — the same geometry, two different depth
                 colours.

Put a theme class on any element and everything inside it wears that theme. No
js, no rebuild.

EVERY SURFACE IS A TRIPLET
  The surface ladder follows the palette's convention exactly: a triplet plus a
  composed value built from it.

    --bg-container-main-rgb:37,41,50;
    --bg-container-main:rgb(var(--bg-container-main-rgb));

  Consumers keep saying var(--bg-container-main) and nothing changes, but a skin
  that needs a translucent surface — glass, an overlay, a scrim, a face that
  lets the room through — can now say rgba(var(--bg-container-main-rgb),.6)
  without a second token being invented for it. Nothing in the kit holds a raw
  colour value outside this file.

THE DEPTH COLOURS
  --shadow-rgb        the colour surface relief is made of — the diffuse,
                      low-alpha shadow that cards, rows and controls wear
  --shadow-block-rgb  the colour a large block's cast shadow is made of. A
                      deeper tint at a single strong alpha, because a page block
                      sits ABOVE the page rather than swelling out of it.
  --highlight-rgb     the colour the lit side is made of, for both

  --shadow-strength   how hard the relief shadow bites in this theme
  --highlight-strength how hard the lit side reads in this theme

WHY THE TWO STRENGTHS EXIST
  The layer geometry and its alpha ladder are written literally in each skin, and
  the same ladder cannot serve both a light and a dark room. On #eef0f5, black at
  four percent is a soft shadow and white at ninety percent is a believable lit
  edge. On #262a33 those same numbers invert the whole material: the shadow side
  vanishes into the dark surface while the highlight blazes, so every part looks
  lit from below and nothing casts.

  So each theme states a multiplier and the skins write rgba(..., calc(.04 *
  var(--shadow-strength))). The dark theme runs the shadow five times harder and
  the highlight at an eighth, which is roughly the ratio a dark room actually
  has: almost all shadow, a thin rim of light.

  --shadow-block-rgb keeps its literal alphas. A block's cast shadow is already
  strong enough to read on a dark surface, and multiplying it turns a page into
  a hole.

Held as "r,g,b" numbers, not hex, because a soft shadow is six to eight layers
and each layer sets its own alpha: rgba(var(--shadow-rgb),.04). That alpha ramp
is what makes the edge dissolve instead of stopping. There are no shadow tokens
beyond these two colours — the house rule is that depth geometry is written
literally in the skin that owns it, so every atom shows you its own layers.

WHY THE RADIUS LADDER GOT LONGER
  This material reads as one poured surface, and that depends on very large
  corners: the shell is 3.25rem, the well 2.25rem, a card 1.75rem. The ladder
  stopped at --radius-3xl. Four steps were added using the existing verbs
  (4xl 5xl 6xl 7xl) rather than inventing a second scale. Flagged in QA_LOG.

WHY REM
  html{font-size:clamp(11px,2vw,16px)} means every rem token breathes with the
  viewport. Shadow reach is written in rem for the same reason: at a narrow
  viewport the material compresses instead of shattering. Border widths and the
  pill/round radii stay absolute.

THE INK LADDER AND WHAT IT IS ALLOWED TO CARRY
  strong  headlines
  text    body
  muted   secondary body
  dim     labels, hints, placeholders, small numerals — clears 4.5:1
  faint   marks and rules ONLY — clears the 3:1 non-text floor and nothing more

  faint is not a text colour. Three consumers were using it for real text (the
  search placeholder, the DayNav date numerals, the StyleToggle labels) and have
  been moved to dim. If a string has to be read, it is dim or better.

THE PAGE GRADIENT IS TWO STOPS, AND IT HAS TO STAY THAT WAY
  It used to have five. Five stops looked more considered and produced a visible
  hard ring across the page, which is worth understanding because it will happen
  again to anyone who "improves" it.

  A gradient interpolates linearly BETWEEN stops, so what the eye picks up is not
  the colours, it is the change in RATE at each stop. The old dark ramp moved its
  blue channel by -8, -8, -2, -11 units across its four segments: the third
  segment nearly stopped falling and the fourth fell off a cliff. That corner in
  the rate curve is a Mach band — the eye manufactures a bright line at a rate
  discontinuity even when no such line exists in the pixels. Adding more stops
  makes it worse, not smoother, because every stop is another chance for a kink.

  Two stops cannot kink. The endpoints are the same as before, so the page reads
  the same at the corners, and everything between them is one constant rate.

  What remains is 8-bit quantisation banding, which is unavoidable in a low
  contrast ramp this wide and is what container-grain is for: the noise layer
  dithers the steps below the threshold where the eye can find them. It sits at
  7.5% opacity in overlay — enough to break the bands, not enough to read as
  texture. If you ever see banding again, the grain is missing from <body>
  before the gradient is wrong.
