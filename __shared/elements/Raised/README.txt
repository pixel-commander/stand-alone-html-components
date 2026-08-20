Raised — a raised face standing up inside a recess.

Named for what is INSIDE it. The surround is sunken, the face is raised. Well is
the inverse: same two wrappers, same .5rem lip, atoms swapped — which is the
point worth making about the tier split, since inverting the material costs no
layout work at all.

DOM CONTRACT
  <div class="container-sunken raised grid">
    <div class="container-raised raised-inner grid">
      …
    </div>
  </div>

  Two wrappers, because two atoms. The outer one carries .5rem of padding — just
  enough to leave a lip of surround showing all the way round the face. The
  inner one is the face and carries the content padding.

WHEN TO USE WHICH
  Raised — a face standing up in a hole. The face is a THING.
           Keys, tiles you press, a selected item, a knob, a chip that matters.
  Well   — a frame holding content. The content is INSIDE something.
           Panels, shells, fields, lists, anything you read.

  The wrong one is not a small mistake. Raised says "push me"; Well says "look
  in here". Using Raised for a paragraph makes the paragraph look clickable, and
  people will click it.

WHY THE LIP IS 8px AND NOT MORE
  The lip is the only thing telling you the two surfaces are one piece of
  material rather than a card sitting on a card. Too little and the shadows
  collide; too much and the surround becomes a border, which is a different idea
  entirely. Half a rem is the smallest gap that still reads as a lip at every
  step of the viewport clamp.

MATCH THE COMPRESSIONS
  sunken+raised, mid+mid, tight+tight.

MODIFIERS
  raised        snug (.1875rem lip) · roomy (.625rem lip)
  raised-inner  bare (no content padding) · tall (a minimum height)

KEYS
  children / main   what stands in the recess
  container_class   the surround's skin
  item_class        the face's skin
  handleClick       if the face is pressable, it takes the house handler word
  is_active         arrives as is-active; the face presses in
