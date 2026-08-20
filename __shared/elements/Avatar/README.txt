Avatar — initials in a recess.

DOM CONTRACT
  <i class="container-sunken avatar round tight">JR</i>

  One element. The initials are content, not a background image, so there is
  nothing to load and nothing to fall back to.

ON COLOUR
  The keyring has `color`, but the styling rule says a component never names a
  hue. So an avatar that should read differently wears an accent-* class and
  inherits: accent-tertiary, not color="green". `color` stays for the case
  where a row genuinely carries its own value from the db.

KEYS
  name / label   the initials
  item_class     this one avatar's skin on top of the set's
