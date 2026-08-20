ATOMS — css only. One folder per atom, grouped by kind.

WHAT AN ATOM IS
  A skin. Background, border, radius, shadow, and the text colour that belongs
  to that surface. That is the whole list.

WHAT AN ATOM IS NOT
  No grid. No padding. No font-size. No width or height. No child selectors
  reaching into content. No js. An atom has no size of its own — the demos
  borrow `demo-atom` from HOUSE_CSS to give it a box to be seen in.

  This is why the split pays: an element can change its whole arrangement and
  the material does not move, and a theme can change the material and no
  arrangement moves.

MODIFIERS
  Each atom owns its modifier words, always scoped to itself
  (.container-raised.mid, never a global .mid). `mid` and `tight` are the
  shadow compressions: same ratio, less reach, because a 22px control wearing
  the panel ramp has no edge left to find.

STATE WORDS
  The keyring's is_* flags arrive as is-* classes: is-active, is-selected,
  is-disabled. An atom answers them with material — raised goes sunken when it
  is active, because that is what pressing a soft surface does.

DEPTH IS WRITTEN LITERALLY
  Every ramp is spelled out in the atom that owns it, per the house rule. There
  are no shadow tokens, only the two colours the layers are made of. Reading an
  atom shows you its material with nothing to look up.

imports.css lists every atom. A page links that one file.
