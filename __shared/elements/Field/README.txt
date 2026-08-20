Field — a text input in a recess.

DOM CONTRACT
  <label class="container-sunken field grid pill">
    <svg/>
    <input>
  </label>

  A leaf, so the atom and the element class ride the same node. The label IS
  the control's box — that gives the whole recess a click target without a
  for/id pair to keep in sync.

WHY SUNKEN
  An input is a place things go into. Raised inputs read as buttons and get
  clicked instead of typed in.

KEYS
  value / query   what is held. query when it filters a set, value otherwise.
  handleChange    receives the new value, not the event
  handleSubmit    send what is held onward
  error           the message; wear ui-error from HOUSE_THEME to show it
