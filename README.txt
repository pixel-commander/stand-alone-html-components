README — for Claude
===================

A sandbox of small, stand-alone components written in plain HTML, CSS, and
vanilla JavaScript. A component runs by opening its index.html in a browser,
with nothing built, installed, or compiled first.


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

The ones built so far are custom elements, each holding its state in private
fields behind a getter and setter pair, where assigning a value re-renders
the element. Each carries two stylesheets: one dressing the host page so the
component has a frame to fill when opened on its own, and one carrying the
component itself.

A component is written to be converted to React and shipped on its own, and
three habits decide how much of that conversion is mechanical.

Markup is written as markup. A component keeps its structure in a template
and clones it, rather than assembling it from createElement calls. The
structure then reads as tags in one place, which is the form React wants,
so converting it is a transcription rather than a translation. Building the
same DOM by hand means every element has to be read back out of the
statements that made it before it can be written as a tag again.

Position is decided in JavaScript, not by the stylesheet. A cell that is
styled for being third in its row, or for falling on the heading row, is
styled through a class the script puts there, not through a selector that
counts children. Counting selectors do not survive the move to a utility
class system, and a component that already names what a cell is loses
nothing on the way out.

The markup carries its own root, and the stylesheet targets that root by
class. A custom element is both the tag and the container it wraps, and a
React component returns only what was inside it — so a class the host
element carried, and any rule written against the tag name, go missing on
the way out and take their styling with them. A component whose template
opens with a root element carrying the class has nothing to lose there, and
rules already written against a class carry over untouched.

An element that gives up its own box that way still has to sit in whatever
laid it out. Where a component mounts another one, the mounted tag is left
carrying no box of its own, and the stylesheet says so, so the root inside
it takes the place the tag used to hold.

That mounting is the one thing a template does not do. A tag with a dash in
it upgrades when it is created and stays inert inside a template, so a
component that mounts another creates it rather than cloning it. Everything
else is markup and belongs in the template.


Shared
------
The shared area holds what the shell itself is made of, not a library for
components to draw on.

The stylesheets the shell loads are split three ways: a theme carrying the
colors, a grid providing layout — a .grid class with sidebar, header/footer,
and holy-grail variants, where children are placed into named regions by a
data-area attribute — and a page stylesheet dressing the shell's own chrome.
The theme is a set of custom properties, so recoloring the shell means
editing one file.

Shared components live one folder each, holding their own stylesheet and
script. The list in the shell is one of these: a custom element handed an
array of entries, rendering each as a real link and announcing a selection
as an event. It marks the current entry, and shows a caller-supplied message
when handed nothing.

A template folder is the starting point for a new component. Copying it
yields a page that links one stylesheet and one script of its own and
nothing else — no shell assets, no shared theme. One stylesheet carries only
enough to let a component fill the frame it is loaded into; the other is
where the component's own styling goes. The demo script starts empty, and
the component script carries the shape every component here shares, written
out once so it does not have to be typed again: a template holding the
markup, a private field behind a getter and setter, a render that clones the
template, and the registration at the bottom. Three names in it are
placeholders, and replacing them is the first thing a copy does.

The template carries its own README, and that README is the stamp — the list
of what makes a new project complete. Copying the folder is the first step
on it, not the whole of it. The steps that get forgotten are the last two:
the loader cannot read a directory, so a project stays invisible until it is
added to the array in the shell, and anything a project carries beyond the
copied files is a path that goes in PATHS.txt.


Automation
----------
Two scripts run the mechanical parts of the stamp. Each lives in its own
folder with a README describing what it does and what it refuses to do.

The first starts a project. It copies the template, replaces every
placeholder with the name it was given, and adds the project to the array
the loader draws its nav from. It refuses a name that is already taken and a
name a custom element cannot carry, and it writes nothing when it refuses.
What it leaves is the rest of the stamp.

The second ships one. It reads a finished project, writes the half that
leaves into a shipped folder as a React component and its stylesheet, and
packs that folder into a zip beside itself. The demo stays behind — the
example values and the page that mounts them prove the component works and
are not part of it.

It checks before it writes, and a project that is not ready is reported
rather than converted. What it looks for is the handful of things that do
not survive the move: markup assembled statement by statement rather than
written as markup, a stylesheet that counts children to decide position, a
class carried by the host element that disappears with it, and rules written
against a tag name that does not survive either. Any one of them stops the
run and nothing is written.

What it cannot decide, it hands back rather than guessing. An asset path is
the case that comes up: relative to the project folder before, relative to
nothing after.

It does not claim to finish the conversion. The markup carries over as it
stood, and the expressions between the tags are still to be written.


Shipping
--------
A shipped component is unpacked into a components folder somewhere else, so
it names nothing outside itself. Its stylesheet is named the same in every
shipped folder, which keeps the import inside the component identical every
time and keeps a folder holding several of them free of collisions.

Every shipped component takes data and a className whether it used them or
not, because a component dropped into an application is expected to take
both.

RULES.txt is how to work here. PATHS.txt is where everything lives.
