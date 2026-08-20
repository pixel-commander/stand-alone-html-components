Card — a framed region: the shell/inner split, and the reason for it.

DOM CONTRACT
  <section class="container-raised card-shell mid">   the SKIN. Atom, state, nothing else.
    <div class="card grid">                   the TEMPLATE. Grid and padding, no surface.
      …
    </div>
  </section>

WHY TWO ELEMENTS
  One element carrying both a shadow and a grid cannot be re-skinned without
  touching its layout, and cannot be re-laid-out without touching its material.
  Split them and container_class swaps the whole surface — raised to sunken,
  soft to flat — with the inside untouched.

  It also fixes a smaller thing: padding on the same node as a large inset
  shadow puts content inside the blur, where it goes muddy. The inner element
  keeps content clear of the edge.

  Leaves do not do this. A Button is one element, forever.

KEYS
  title / label / description  the head
  header / main / children     GridAreaProps slots
  container_class              the shell's skin — how a card becomes a well
  is_open                      arrives as is-open
