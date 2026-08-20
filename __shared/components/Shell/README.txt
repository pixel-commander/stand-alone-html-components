Shell — the app frame. A raised plate with a recess cut into it.

DOM CONTRACT
  <div class="container-raised shell-frame">           rises out of the room
    <div class="container-sunken shell grid side-l">   cut into the plate
      <div class="shell-side" data-area="side">…</div>
      <div class="shell-main" data-area="main">…</div>

  The layout is grid.css: side-l plus data-area placement. The shell's own css
  adds padding and the min-height:0 chain, and nothing else.

WHY min-height:0 EVERYWHERE
  A grid item's default minimum is its content, so one long list makes the
  whole page grow and the window scrolls. Zeroing the minimum at every level
  lets the track win, which is what keeps the frame the size of the viewport.

  That is the rule for this kind of app: the page never scrolls, the panes do.
  body wears no-overflow from HOUSE_THEME, the panes wear scroll-area, and a
  scrolling grid wears scroll-y so its rows pack at the top instead of
  stretching to fill.

  A document view is the exception — it opts out and lets the page scroll.

KEYS
  side / main / nav / header / footer   GridAreaProps, straight off the keyring
  container_class                        the frame's skin
