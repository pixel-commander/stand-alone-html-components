style-guide — the page that reads the tree.

WHAT IT IS
  Top tabs are the tiers. The left column lists what is in that tier's folder.
  Click one and it loads into the stage. If the loaded part declares variants,
  a second tab bar appears in the stage header and filters to one of them.

  Nothing about the parts is hand-written here. The list comes from
  src/manifest.json, the markup comes from each part's own js/<Name>.html (or
  demo/index.html for an atom), the css is linked on demand from the part's own
  folder, and the notes panel is that part's README.txt. Add a part to the
  manifest and it appears with no page edit.

THE URL IS THE STATE
  #/style-guide/atoms/container-raised/mid?mode=dark&accent=tertiary
    main         style-guide
    page         the tier
    view         the part
    tab          the variant
    vars         mode and accent, which survive every navigation

  Every click is one of the five verbs. Picking a part is update-path, which
  clears the variant automatically — `mid` on one atom means nothing on the
  next. The options are update-var, so a link carries the whole state: a
  teammate opening it lands on the same part, in dark, in the same accent.

THE PAGE DOES NOT SCROLL
  body wears no-overflow. The frame is the viewport, the two panes scroll
  inside it, and the panes wear scroll-y so their rows pack at the top.

  pages and dashboards are placeholders on purpose — the tier exists so the
  guide has a shape to grow into.

THE VARIANT BAR SITS ON ITS OWN ROW, AND THAT IS LOAD-BEARING
  .guide-stage-head is minmax(11rem,1fr) max-content — the title takes the
  flexible column, and anything in the second column is sized to its content.
  A wrapping tab bar cannot live there: auto-fill counts tracks against the
  available width, a max-content column IS the content's width, so it resolves
  to one track and the tabs stack vertically.

  So the bar carries .full from grid.css (grid-column: 1 / -1), which drops it
  onto its own full-width row under the title. That is the whole fix, and it is
  why .full exists rather than each page inventing a span.

SCROLLBARS ARE THEME-LEVEL, NOT PAGE-LEVEL
  They were browser default until now, which is why they read as bright chunky
  bars sitting on top of the content in a dark room. theme.css styles them from
  the surface tokens: a pill thumb in --bg-container-raised on a transparent
  track, with a transparent border plus background-clip:padding-box to inset the
  thumb from the edge. Both themes get correct bars from their own tokens, and
  scrollbar-width/scrollbar-color cover Firefox.
