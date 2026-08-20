Slider — a thumb in a channel.

DOM CONTRACT
  <label class="slider"><input type="range"></label>

  The track and thumb are pseudo-elements of the native input, so their depth
  cannot live in an atom — a pseudo-element cannot wear a class. This is the
  one place the ramp is written inside an element's own css. It is still
  written literally, and it is still the tight compression, so it is the same
  material.

THE FILL
  --fill is set by js as a percentage. It is a data value, not styling: no
  visual decision is being made in script, the same way a progress width is
  not a design.

KEYS
  value          where the thumb is
  layout         the bounds. OPEN QUESTION in QA_LOG: min/max/step have no word
                 on the keyring, and the keyring calls layout "the component's
                 layout datum". Confirm or add a word.
  handleChange   receives the new value, not the event
