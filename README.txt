README — for Claude
===================

A sandbox of small React components, each written on its own and previewed
in a shell that carries everything they need. Nothing is built, installed,
or compiled first. The compiling happens in the browser, as the page loads.


The shell
---------
The repo opens on a loader page: a grid with a header across the top, a list
of components down the left, and the selected component filling the rest.

The shell is where the runtime lives. React, the browser build of Tailwind,
the in-page compiler, and the plotting library are loaded once, by the shell,
and every component draws on them. A component carries none of it, which is
why a component folder holds so little.

Selecting a component fetches its source, compiles it, and mounts it into the
page. There is no frame around it — the component becomes part of the shell's
own document, so the styling and the runtime the shell loaded are already
there when it arrives.

Its list is a hand-maintained array of entries, each carrying a name to show
and the class the component is defined as. A page cannot read a directory, so
a new component has to be added to that array to appear. The name is recorded
in the address bar, so a reload returns to the same one.


Components
----------
Each component lives in its own folder and is one arrow function returning
markup. It takes props with defaults, takes a className whether it uses it or
not, and holds whatever state it needs where React holds state.

There is no host page, no custom element, and no stylesheet describing the
component. The styling is carried in the markup as utility classes, so what
an element looks like and what it is are stated in the same place, and moving
the markup moves the styling with it.

What a component folder holds is the component, a demo that renders it with
realistic values, a page with nothing in it but a mounting point, and a
stylesheet for anything utilities cannot say.

The demo is the fixture. It is how the component is checked, and its values
are the example of how the component is used.


Drawing
-------
A component that draws rather than lays out keeps its geometry in a separate
file, as a function that takes values and returns what to draw. It touches no
elements and reads nothing off the page, so it can be checked on its own, and
the component that calls it stays a component rather than becoming a plotter.

Where a chart needs to know how big it is, it measures its own container and
redraws when that changes.


Shared
------
The shared area holds what the shell itself is made of, not a library for
components to draw on. The stylesheets it loads are split three ways: a theme
carrying the colors, a grid providing layout, and a page stylesheet dressing
the shell's own chrome.

A few small functions live there too, for the things more than one component
needs and none of them should own.

A template folder is the starting point for a new component. Copying it
yields a component, a demo, a page, and a stylesheet — the same four things
every component here has.


Automation
----------
Each script lives in its own folder with a README describing what it does and
what it refuses to do.

One starts a project. It copies the template, replaces every placeholder with
the name it was given, renames the component file to match, and adds the
project to the array the shell draws its nav from. It refuses a name that is
already taken and a name that cannot be used, and it writes nothing when it
refuses. What it leaves is a component that renders.

One serves the repo, because the shell fetches and compiles rather than
linking, and fetching needs something to fetch from.

One reads a stylesheet and says what its rules would be as utility classes.
It writes a file naming the classes for each selector, and carries anything
it could not convert into that file rather than dropping it.

RULES.txt is how to work here. PATHS.txt is where everything lives.
