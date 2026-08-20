StyleToggle — a switch that changes which material the whole system wears.

WHAT IT IS
  A 16rem switch, a knob that slides, and three radios naming the material. It
  is a component rather than an element because it does things: it owns
  handlers and it writes state.

DOM CONTRACT
  <div class="style-toggle grid" data-style-toggle>
    <label class="style-toggle-switch">
      <input type="checkbox" data-mode>
      <span class="container-sunken style-toggle-track pill" data-track>
        <span class="container-raised style-toggle-knob round" data-knob></span>
      </span>
    </label>
    <div class="style-toggle-styles grid" role="radiogroup">…</div>
  </div>

  The input is a full-size transparent layer over the switch, so the whole
  16rem block is the hit target and the keyboard still gets a real checkbox.

  The knob lives INSIDE the track. That is what lets it slide by transform
  alone, with nothing measuring anything.

THE THREE MATERIALS ARE JUST DIFFERENT ATOMS
  neumorphism     container-sunken  + container-raised
  skeuomorphism   container-carved  + container-domed
  domed           container-carved.shallow + container-domed.blurred

  The component swaps class strings and touches no geometry, no colour and no
  shadow. That is the return on atoms being skins and nothing else: a whole
  change of material is a lookup table three lines long.

STATE
  mode and style are useURL vars, so the choice is in the url and a link carries
  it. Nothing is kept in a local variable.

KEYS
  value / selected   which material
  handleToggle       reports the state it moved TO
  handleSelect       fires with the chosen material
  is_disabled        arrives as is-disabled; the atoms answer it
