TaskList — a set of rows, and the only place a set is allowed to exist.

DOM CONTRACT
  <div class="task-list grid">
    <div class="row-quiet task-row grid">
      <label class="checkbox">…</label>
      <span>…title…note…</span>
      <span class="chip-main task-row-tag">Design</span>
    </div>
  </div>

  auto minmax(0,1fr) auto: the checkbox and the tag take what they need, the
  body absorbs everything left, and a long title truncates the track rather
  than the row.

WHY THE ROWS ARE TRANSPARENT UNTIL TOUCHED
  Twelve raised rows in a list is twelve competing objects. row-quiet is nothing
  until hover, then it lifts; selected presses in. The list stays one surface
  and only the row under the cursor becomes material.

DONE IS is-done, NOT A COLOUR
  The row keeps its strikethrough and drops the title to dim ink. Colour alone
  would carry the state, and colour alone is never enough.

KEYS
  items / rows                HouseKey rows: id, title, description, value
  selected                    which id
  handleSelect / handleToggle the house handler words
  Item / Container            the rendered atoms, when the caller supplies them
  item_class / container_class the row's skin and the set's
