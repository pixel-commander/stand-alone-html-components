INSTALL-NEW-COMPONENT
=====================

What it does
------------
Takes one shipped package and puts it where it belongs in the application
repo, as a CDS React UI library. It is the third step of the arc: one script
starts a project, one ships it, and this one lands it.

It runs the repo's own library generator rather than writing the wiring
itself. The path mapping, the project, the test runner, the linter, and the
link to the Storybook host are all that generator's work, and are not
copied, guessed, or maintained here.


What it asks for
----------------
The component name, and the path to the application repo. The repo is not
remembered between runs and is not written down anywhere, because the two
repositories are unrelated and neither is inside the other.


What it writes
--------------
A library named after the component, holding the package unpacked beside
the generated configuration. The generator's placeholder component and its
placeholder story are both replaced by the shipped ones, which carry the
same names and land on top of them.

The project README travels with the component and sits beside the library
rather than inside the source, where the generator's own README already is.

The report the shipper printed does not travel. It describes a conversion,
which is not something the application repo has any use for.


The prefix
----------
Every component exported from the design system carries a Cds prefix, so
the class is renamed on the way in and the props type with it. This is the
one place a shipped name changes, and it changes because the destination
says so — a package landing anywhere else keeps the name it left with.

The story title is left alone. The Storybook host prefixes every title in
that folder on its own, and a title that arrived prefixed would be nested
under the word twice.


What it refuses
---------------
A component that was never shipped. A repo with no workspace file at its
root. A library that already exists, which is refused before anything is
generated and leaves what is there untouched.


What is left to you
-------------------
The expressions between the tags, and the values in the story. The demo the
component was modelled on stays behind when the package leaves, so the
values it was checked against are not in the package to copy. The component
compiles and the story renders; neither shows anything real yet.
