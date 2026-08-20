Well — a well cut into a raised frame.

Named for what is INSIDE it. The frame is raised, the well is sunken. Raised is
the inverse.

DOM CONTRACT
  <div class="container-raised well grid">
    <div class="container-sunken well-inner grid">
      …
    </div>
  </div>

  The outer wrapper is the plate and carries .5rem of padding — the lip of
  raised surface showing all the way round the cut. The inner wrapper is the
  well and carries the content padding.

WHEN TO USE IT
  A frame holding content. The content is INSIDE something: panels, shells,
  fields, lists, anything you read. Raised is for a face you press.

WHY THE LIP IS 8px AND NOT MORE
  The lip is the only thing telling you the two surfaces are one piece of
  material rather than a card sitting on a card. Too little and the shadows
  collide; too much and the frame becomes a border, which is a different idea
  entirely.

MATCH THE COMPRESSIONS
  raised+sunken, mid+mid, tight+tight.

MODIFIERS
  well        snug (.1875rem lip) · roomy (.625rem lip)
  well-inner  bare (no content padding) · tall (a minimum height)

KEYS
  children / main   what goes in the well
  container_class   the frame's skin
  item_class        the well's skin
  is_open           arrives as is-open
