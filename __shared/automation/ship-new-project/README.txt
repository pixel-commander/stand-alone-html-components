SHIP-NEW-PROJECT
================

What it does
------------
Takes one finished project and writes the shippable half of it into shipped,
as a React component and its stylesheet, then zips the folder so it can be
carried somewhere else and unpacked into a components folder.

It checks first. A project that is not ready is reported rather than
converted, and nothing is written at all.


What ships and what does not
----------------------------
A project is two things wearing one folder. The component is the part that
leaves; the demo is the part that proves it works and stays behind.

Carried over:

  the component script    becomes the React component, saved as tsx
  the component's css     becomes styles.css, imported by the component
  the project README      describes the thing being shipped
  an icons folder         when the project has one

A story is written beside the component, from the same reading of the
fields. It does not run here — nothing in this repo installs Storybook — and
it is not checked before it is written. It runs where the package is
unpacked.

Left behind:

  the demo script         example values, not the component's own
  the page stylesheet     dresses the demo page, not the component
  the demo page           the fixture the conversion is checked against

The stylesheet is renamed to styles.css for every component, so the import
inside the component is the same line every time and a folder holding
several of them has no collisions.


Where the shape comes from
--------------------------
The component and the story are not written by this script. It reads the
two files in the react template, fills the holes, and writes the result. The
shape every shipped component wears is held there and changed there, and
this script only decides what goes in the holes.


What blocks it
--------------
These are the parts of a conversion a script cannot do. Each is reported
with where it is and what to do about it, and any one of them stops the run.

  Markup built from createElement calls. The conversion needs markup it can
  read as markup. Structure that was assembled statement by statement has to
  be recovered before it can be written as tags again.

  A stylesheet that counts children. A rule that styles a cell for being
  third in its row states a position the stylesheet worked out by counting,
  and a utility class system has no way to say that. The position has to be
  decided where the elements are made and put on them as a class.

  A class added to the host element. A custom element is both the tag and
  the container, and a React component returns only what was inside it. A
  class the host carried disappears with it, and the styles that targeted it
  stop matching. The class belongs on a root element inside the markup.

  A stylesheet written against the tag name. The tag does not survive, so
  neither do rules that name it. Rules written against the class carry over
  untouched.


What it hands back to you
-------------------------
Anything it found that it will not decide on your behalf. An asset path is
the case that comes up: a path that was relative to the project folder is
relative to nothing once the component moves, so it is surfaced rather than
quietly rewritten.


What it does not claim
----------------------
The markup carries over as it stood. What the script filled in at run time
is not filled in for you — the expressions between the tags are yours to
write, and the demo is what to check them against.

Props are read from the fields, and their types are read from what those
fields were set to. A field holding a list becomes a list of records, since
the shape of the rows only ever existed in the demo. Every component also
receives data and className whether it used them or not, because a component
dropped into an application is expected to take both.

The result is a component that compiles and a conversion that is started,
not finished.
