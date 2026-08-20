ScanButton — a domed face with a print on it that reads, then accepts.

DOM CONTRACT
  <button class="scan-button" type="button" data-scan aria-label="Scan">
    <span class="container-domed scan-button-face round"></span>
    <span class="scan-button-print"><svg>…five arcs…</svg></span>
    <span class="scan-button-note" data-scan-note>touch to scan</span>
  </button>

  A component, not an element: it holds handlers and it runs a sequence.

THE MATERIAL IS ALREADY OURS
  container-domed came out of this exact button, so the face needs no new css —
  it wears the atom and the component adds only size and the press scale. That
  is the whole argument for the tier split arriving in one file: a reference
  this elaborate reduces to one atom and forty lines.

THE PRINT IS FIVE ARCS, NOT ARTWORK
  Five concentric arc paths, each one `A` command, drawn with stroke-dasharray:1
  and pathLength:1 so the dash maths is in fractions and does not care about the
  path's real length. Hover pulls stroke-dashoffset from .35 to 0 and the arcs
  draw themselves inward.

  It is deliberately a stand-in. Drop your own glyph in the same span and the
  five path rules apply to it unchanged, as long as it is stroked and carries
  pathLength.

THE SEQUENCE, IN HOUSE STATE WORDS
  is-dirty     reading. The arcs hold at full length and pulse on a stagger,
               because "working" needs motion that is not progress — a scan does
               not know how far along it is.
  is-selected  accepted. Pulse stops dead and the colour moves to tertiary.
               Stopping is the signal; the colour only confirms it.
  is-active    pressed. The face scales to .99.

  The pulse is off under prefers-reduced-motion, and the note carries the state
  in words as well as colour.

WHY THIS STATE IS LOCAL AND NOT IN THE URL
  A scan in progress is not a place you can link someone to. useURL is for state
  that should survive a reload; this should not.

KEYS
  handleClick / handleSubmit   start the read, report the result
  is_dirty / is_selected / is_active   the three states
  label                        the accessible name
  description                  the note under the face
