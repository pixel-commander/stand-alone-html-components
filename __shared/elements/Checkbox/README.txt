Checkbox — the smallest thing this material has to survive.

DOM CONTRACT
  <label class="checkbox">
    <input type="checkbox">
    <span class="container-raised checkbox-box tight"><svg/></span>
  </label>

WHY tight AND NOT THE FULL RAMP
  This is the whole argument for the three compressions. A 26px box carrying
  the panel ramp — 8 layers reaching 2rem — has no edge left anywhere: it is a
  pale smudge you cannot find, let alone click. tight keeps the same soft ratio
  and pulls the reach in to a few tenths of a rem, so it still reads as the
  same material at a fifteenth of the size.

  Checked goes sunken, not coloured-in: the tick arrives in the accent and the
  box presses. Colour alone would carry the state, and colour alone is not
  enough.

KEYS
  value / handleChange / handleToggle / label
