Switch — a handle that slides in a track.

DOM CONTRACT
  <label class="container-sunken switch pill">
    <input type="checkbox">
    <span class="container-raised switch-handle tight round"></span>
  </label>

  Two atoms, one control: the track is sunken, the handle is raised tight. The
  same material at two compressions is what makes it read as one object.

WHY THE INPUT IS HIDDEN AND NOT REPLACED
  It keeps the keyboard, the checked state and the label association for free.
  Rebuilding those on a div is how a switch stops working for half its users.

KEYS
  value         what is held
  handleToggle  reports the state it moved TO, per the keyring
  label         the visible name, if the caller renders one beside it
