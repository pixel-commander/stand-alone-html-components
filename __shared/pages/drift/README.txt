drift — the workspace, built only from parts.

WHAT IT PROVES
  Not one class in this page is new. Every surface is an atom, every control is
  an element, every region is a component, and the page's own css holds four
  layout rules and nothing else: the two column templates, the sidebar width,
  and the responsive collapses.

  If a card here looks wrong, the fix is in components/Card. That is the whole
  return on the tier split.

THE PAGE DOES NOT SCROLL
  body wears no-overflow, the frame is the viewport, and the column pair inside
  the well wears scroll-area and scroll-y. Rows pack at the top instead of
  stretching, so a short list does not leave three widgets stretched down the
  page.

STATE
  Nav goes through useURL: a click is go('update-path', {page}). Softness and
  mode are vars, so a link carries them. The controls layer sets --fill and
  --softness from data values and touches nothing else — no visual decision is
  made in script.

WHERE IT CAME FROM
  uploads/shadow-specs/soft-interface.html. That file stays pristine; this is
  the converted one.
