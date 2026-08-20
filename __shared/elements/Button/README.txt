Button — the leaf control.

DOM CONTRACT
  <button class="button-main button">label</button>
  One element. A leaf never grows a second one.

  button-main   the skin (atoms/buttons)
  button        this element's css: size, padding, type. Nothing about surface.

KEYS
  label         rendered, never called
  handleClick   the house handler word. on* is only ever legal on the dom node.
  is_active     arrives as is-active; the atom answers by going sunken
  is_disabled   arrives as is-disabled AND the dom disabled attribute
  item_class    one button's own skin on top of the set's

WHY min-height AND NOT height
  Type scales with the viewport clamp. A fixed height clips the label at the
  wide end of the clamp; min-height lets the control grow with its own text.
