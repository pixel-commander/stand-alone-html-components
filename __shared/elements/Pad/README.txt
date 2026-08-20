Pad — the inverse of Well: a recess with a raised face inside it.

DOM CONTRACT
  <div class="container-sunken pad-recess grid">
    <div class="container-raised pad-face grid">
      …
    </div>
  </div>

  Same two wrappers, same .5rem lip, atoms swapped. That is the entire diff
  between this element and Well — which is the point worth making about the
  tier split: an inversion of the material costs no layout work at all.

WHEN TO USE WHICH
  Well  — a frame holding content. The content is INSIDE something.
          Panels, shells, fields, lists, anything you read.
  Pad   — a face standing up in a hole. The face is a THING.
          Keys, tiles you press, a selected item, a knob, a chip that matters.

  The wrong one is not a small mistake. A Well says "look in here"; a Pad says
  "push me". Using a Pad for a paragraph makes the paragraph look clickable,
  and people will click it.

MATCH THE COMPRESSIONS
  sunken+raised, mid+mid, tight+tight. A block-drop recess around a tight face
  reads as two materials, because it is.

MODIFIERS
  pad-recess   snug (.1875rem lip) · roomy (.625rem lip)
  pad-face     bare (no content padding) · tall (a minimum height)

KEYS
  children / main   what stands in the recess
  container_class   the recess's skin
  item_class        the face's skin
  handleClick       if the face is pressable, it takes the house handler word
  is_active         arrives as is-active; the face presses in
