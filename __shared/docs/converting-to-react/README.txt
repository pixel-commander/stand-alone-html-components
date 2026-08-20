CONVERTING TO REACT — the process
=================================

What this describes
-------------------
A repeatable conversion that turns one stand-alone component into one React
component. The components in this repo were written in a single shape, and
that shape maps onto React almost mechanically. This document is the map.
It describes the process only. It does not describe a script, and no script
exists yet.

The conversion is per component, one at a time. Nothing here licenses
touching a second component while the first is being converted.


The shape being converted
-------------------------
Every component is a custom element extending HTMLElement, and every one of
them is built the same way:

  - Private fields hold the state, one per prop, each with a default.
  - A getter and a setter for each field. The setter coerces with || to the
    default, assigns, and calls render.
  - connectedCallback adds the element's own class name and calls render.
  - render puts the structure on the page and finishes with
    replaceChildren. A component written for conversion clones a template
    to do it; the earlier ones build the same DOM from createElement calls,
    which is the one part of the shape that has to be undone before it can
    be ported.
  - The element is registered with customElements.define under a
    dash-separated tag name.

Because every setter re-renders, the whole element is already a pure
function of its fields. That is what makes the conversion mechanical rather
than interpretive.


The five moving parts
---------------------
Each conversion is the same five decisions, in this order.

1. PROPS
   The private fields become props. The names carry over unchanged — a
   field named Icon becomes a prop named Icon, and one named link_text
   becomes link_text. A name already written is the name that stays. The || coercion in each setter becomes the prop's default
   value, keeping the same fallback the setter used — an empty string falls
   back exactly as it did before.

2. STATE
   Most components have none. A field is state only when the component
   itself assigns it during an interaction, rather than only receiving it
   from outside. A field that is only ever written by its setter from the
   host page is a prop, not state. A field written by both is a prop the
   component also holds, and that one needs a decision rather than a rule.

3. MARKUP
   A component that keeps its structure in a template hands the conversion
   its markup already written. The template's contents become the returned
   markup nearly as they stand — the tags, their classes, and their
   data-area attributes all carry over, and what the script filled in
   becomes the expressions between them. A component that instead assembles
   its DOM from createElement calls has to have that markup recovered from
   the statements first: each call is a tag, textContent is the child text,
   classList.add is className, dataset.area is a data-area attribute, the
   order of appends is the order of the markup, and the final
   replaceChildren is what the return statement replaces.

   The host element itself disappears. A custom element is both the tag and
   the container; a React component returns only what was inside it. What
   the host element carried — its class name, and any class it toggled —
   has to be carried by a wrapper element in the returned markup instead,
   or the styles that targeted it stop matching.

4. HANDLERS
   Listeners attached inside render become props on the markup. An
   addEventListener for click becomes onClick, and change becomes onChange.
   A handler that calls preventDefault keeps calling it. A callback prop
   that gates whether something is drawn keeps gating it — a component that
   draws no link without a click handler still draws no link.

5. EFFECTS
   Anything render did that outlives a render is an effect. An object URL
   created for a chosen file is the case that appears here: the old setter
   revoked the previous URL before replacing it, and that revoke becomes
   cleanup, both between changes and on unmount.


The CSS
-------
Each component carries two stylesheets and they convert differently.

The first is the host page's scaffolding — it sizes the page and centers or
pads what the page holds so a component opened on its own has a frame to
fill. It belongs to the demo, not to the component, and it does not carry
over. In React the surrounding application provides that frame.

The second is the component's own. It carries over as it stands, with two
changes. The first is forced by the disappearance of the custom element:
rules written against the tag name have to be rewritten against the wrapper
class that replaces it. Rules already written against a class need no change
at all.

The second is that selectors counting children do not carry over. A rule
that styles a cell for being third in its row, or for falling on the heading
row, states a position the stylesheet worked out by counting. A utility
class system has no way to express that, so the position has to be decided
where the cells are made and put on them as a class. Doing that before the
conversion keeps it a change to one component; doing it during the
conversion means changing the markup and the stylesheet at the same time as
the port.

Neither stylesheet gains a preprocessor, a module system, or a naming
scheme it did not already have. Class names carry over unchanged, same as
prop names. A class invented to replace a counting selector is a name that
does not exist yet, and that is a question rather than a judgement call.


Assets
------
Icons are files referenced by path. A path that was relative to the
component folder is no longer relative to anything once the component moves,
so every asset reference is a decision the conversion has to surface rather
than silently rewrite. Where a default points at a bundled file, that
default is one of the things that cannot simply carry over.


The demo
--------
Each component has a page that mounts it and assigns the props it was
modelled on. That page is the test fixture for the conversion: the React
component is right when it renders what the demo rendered, from the same
values. The values themselves carry over as the example usage.


What a conversion produces
--------------------------
For one component: a React component file, a stylesheet, and a README
describing it. The README describes functionality, never paths, same as
every other README here.


What stays true
---------------
The repo's rules do not relax because the target is React. No build step is
introduced into this repo, nothing is renamed, no names are invented for
things that did not have them, and the shared area is not turned into a
library for the converted output. If a conversion needs a name that does
not exist yet, that is a question, not a judgement call.
