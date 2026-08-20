Dome — a carved recess with a domed face lifted into it.

The StyleToggle's skeuomorphic material, held still and made a container. Same
two-wrapper shape as Raised and Well, different pair of atoms.

DOM CONTRACT
  <div class="container-carved dome grid">
    <div class="container-domed dome-inner grid">
      …
    </div>
  </div>

WHY IT IS ITS OWN ELEMENT AND NOT Raised WITH DIFFERENT ATOMS
  The lip. Raised carries .5rem, because a soft ramp needs room to fall off.
  container-carved's inner flood — inset 0 0 7rem 7rem — reaches much further
  in, so at .5rem the recess swallows the face's own shadow and the two read as
  one muddy blob. Dome's lip is .25rem, which is the widest gap where the dome
  still looks seated rather than floating.

  Same idea, different physics, so a different element rather than a modifier.

WHAT MAKES THE FACE READ AS CURVED
  container-domed's curvature is three stacked radial gradients, not a shadow:
  a light pool up-left, a dark pool down-right, and a tighter dark core. A
  shadow can only say how far a surface has moved; a gradient can say the
  surface is not flat. That is the whole difference between this material and
  the neumorphic one, and it is why the dome survives being large.

  is-active swaps the gradient pair rather than the shadow, so pressing it
  changes where the light comes from. Nothing moves, and nothing needs to.

INNER PADDING
  The face carries --padding-5xl (2rem). A domed surface puts its darkest
  falloff right at the edge, so content set close to the rim sits in the shade
  and loses contrast — the face needs more clearance than a flat panel does, not
  the same amount.

MODIFIERS
  dome        snug (.125rem lip) · roomy (.625rem lip) · pill
  dome-inner  snug (1rem padding) · bare · tall · squat · pill · is-active

KEYS
  children / main   what sits on the face
  container_class   the recess's skin
  item_class        the face's skin
  handleClick       if the face is pressable
  is_active         arrives as is-active
