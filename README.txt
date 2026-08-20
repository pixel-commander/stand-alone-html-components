README — for Claude
===================

A sandbox of small, stand-alone components written in plain HTML, CSS, and
vanilla JavaScript. No build step, no bundler, no framework, no package
manager, no dependencies. A component runs by opening its index.html in a
browser.

Nothing here compiles. If a solution needs tooling to run, it is the wrong
solution for this repo.


The loader
----------
The repo opens on a loader page: a grid with a header across the top, a list
of components down the left, and the selected component filling the rest.

The selected component is loaded in an iframe, so it keeps its own document,
its own styles, and its own scripts. Nothing the loader does reaches into a
component, and nothing a component does reaches back out.

The loader is markup only — every rule it obeys is linked in, none of it
written into the page.

Its list is a hand-maintained array of entries, each carrying a name to show
and a path to load. A page cannot read a directory, so a new component has
to be added to that array to appear. Selecting an entry loads its path into
the iframe and records its name in the address bar, so a reload returns to
the same one. With nothing in the array the list says so and the iframe
stays blank.


Components
----------
Each component lives in its own folder and is entirely self-contained. It
brings its own CSS and its own JavaScript and inherits nothing from the
shell. How it wires itself up — ES modules, plain script tags, custom
elements — is its own decision. Components are not expected to resemble each
other, and one component's approach never becomes a repo-wide rule.


Shared
------
The shared area holds what the shell itself is made of, not a library for
components to draw on.

Its stylesheets are split three ways: a theme carrying the colors, a grid
providing layout — a .grid class with sidebar, header/footer, and holy-grail
variants, where children are placed into named regions by a data-area
attribute — and a page stylesheet dressing the shell's own chrome. The theme
is a set of custom properties, so recoloring the shell means editing one
file.

Shared components live one folder each, holding their own stylesheet and
script. The list in the shell is one of these: a custom element handed an
array of entries, rendering each as a real link and announcing a selection
as an event. It marks the current entry, and shows a caller-supplied message
when handed nothing.

A template folder is the starting point for a new component. Copying it
yields a page that links one stylesheet and one script of its own and
nothing else — no shell assets, no shared theme. Its stylesheet carries only
enough to let a component fill the frame it is loaded into; its script
starts empty.

No components have been built yet.

RULES.txt is how to work here. PATHS.txt is where everything lives.
