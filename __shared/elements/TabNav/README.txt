TabNav — a segmented control: a sunken track holding raised tabs.

DOM CONTRACT
  <nav class="container-sunken tab-nav grid pill tight">
    <button class="button-main tab-nav-tab quiet is-selected">All</button>
  </nav>

  The shell wears the atom and the state; the inner buttons wear a quiet skin
  that only becomes material when selected. Nothing is outlined, nothing moves:
  the selected tab is the one that has risen out of the track.

WHY THE TRACK IS SUNKEN
  Sunken says "a set lives here, one of them is chosen". Raised would make the
  whole bar read as a single button.

  grid-auto-flow:column lives in this element's own css, not in grid.css —
  grid.css has no flow utility, and the rule is that a template grid.css does
  not cover is written by the part that owns it, never as a shared utility.

KEYS
  items       the set. Each is a HouseKey row: id, label.
  selected    which id is chosen
  handleSelect fires with the chosen value, per the keyring
  cols        the track list, when the caller wants fixed-width tabs

.wrap — WHY A TAB BAR NEEDS IT
  The base bar is grid-auto-flow:column, which cannot wrap: a column-flow grid
  puts every child in its own track on one line forever. With four or five tabs
  that is exactly right. container-pane arrived with eight modifiers, which made
  nine buttons, and the row simply ran out past the edge of its own rounded
  track and off the page — the last variant was unreachable except by typing the
  path.

  .wrap switches to row flow with repeat(auto-fill, minmax(5.5rem, auto)): the
  browser fits as many 5.5rem-or-wider tracks as the width allows and drops the
  rest onto a second line, using the same gap. 5.5rem is the floor because it is
  the widest short label ("is-active") plus its padding; below that, labels start
  truncating instead of wrapping.

  Wrapping rather than scrolling is the house-correct answer: grid.css has no
  scroll-x pattern, the stage header has vertical room, and a scrolled tab bar
  hides variants behind a gesture with no affordance. max-width:100% is on the
  base now regardless, so a bar can never again paint outside its own track.

  .wrap also sets justify-self:stretch, and that is not cosmetic: auto-fill can
  only count tracks against a DEFINITE width. On a shrink-to-fit parent the bar
  is as wide as its content, auto-fill resolves to one track, and the tabs stack
  into a single vertical column — which is exactly what happened the first time
  this was tried on the tier bar.

  So .wrap belongs on a bar whose width comes from its container, i.e. the
  variant bar in the stage. The tier bar has five fixed short labels and sits in
  a shrink-to-fit header, so it stays on the base single row with max-width:100%
  as its guard. If it ever needs to wrap, it needs a definite width first.
