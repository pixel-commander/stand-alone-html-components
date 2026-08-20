SoftButton — a label floating over a blurred halo.

DOM CONTRACT
  <button class="soft-button" type="button">
    <span class="container-raised soft-button-glow mid round"></span>
    <span class="soft-button-label">Submit</span>
  </button>

  Two children, and the first one is not decoration — it is the whole effect.

THE TRICK, WHICH IS WORTH UNDERSTANDING
  The shadow does not sit on the button. It sits on its own layer, and that
  layer is blurred: filter: blur(.4375rem) over an already-soft box-shadow.
  Blurring a blur is not the same as one bigger blur — box-shadow falls off
  from the element's edge, while filter smears everything including the
  falloff, so the result has no locatable boundary at all. That is why it reads
  as glow rather than as a shadow, and it is the reason the layer has to be a
  separate element: filter on the button would smear the label too.

  The label is a sibling at z-index 1, so it stays perfectly sharp over a
  surface that has none.

HOVER LIGHTS BOTH SIDES AT ONCE
  On hover the layer carries the outer pair AND the inset pair simultaneously —
  raised and sunken in one box — and scales 5%. Nothing in the atom library does
  that, because it is not a state a real surface can be in: a thing cannot bulge
  and dent at the same time. It works anyway, because at this blur radius the
  eye reads the doubled edge as thickness rather than contradiction. The rule
  lives in this component's own css for exactly that reason — it is a trick, not
  a material, and it should not be available to anything else.

  active scales to .99 instead of denting. The halo is already ambiguous; a
  press just needs to be smaller.

KEYS
  label         rendered
  handleClick   the house handler word
  is_disabled   arrives as is-disabled AND the dom disabled attribute
  item_class    the halo's skin — swap mid for tight and it becomes a chip
