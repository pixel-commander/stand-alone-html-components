Section — a labelled group with no surface of its own.

DOM CONTRACT
  <div class="section grid">
    <div class="section-head grid">…label…hint…</div>
    …body…
  </div>

WHY NO ATOM
  Nesting surfaces is how this material turns to mud: a card inside a card
  inside a well leaves every edge fighting. Section is the answer — it groups
  content without adding another surface, so a Card can hold three of them and
  still read as one object.

  If you are reaching for a second frame, you probably want a Section.

KEYS
  title / label / description   rendered
  header / main                 GridAreaProps slots
  children                      the body
