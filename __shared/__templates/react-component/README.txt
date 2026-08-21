THE REACT TEMPLATE — the shape a component ships in
===================================================

What this is
------------
The shape ship-new-project writes, kept as files rather than as strings
inside the script. Nobody copies this folder by hand. The shipper reads it,
fills the holes, and writes the result into shipped.

It exists so the shape can be read and changed by looking at it. What every
shipped component carries — the stylesheet import, the two props every
component receives, the default export — is written here once, and changing
it here changes it for everything shipped afterwards.


What varies and what does not
-----------------------------
Four things are filled in. Everything else is carried over untouched, which
is why every shipped component looks the same.

  the class name        taken from the project name
  the props            one line per field the component declared
  the signature        the same fields again, with their defaults
  the markup           the template literal the component held

The two names in the files are the placeholders. ComponentName is the class,
component-name is the file the story imports. Both are replaced, and nothing
named either is left behind.


Where the holes are
-------------------
There are no markers. The shipper anchors on real lines, so both files stay
valid TypeScript and can be opened and read as what they are.

  the props        the line declaring className, appended to
  the signature    the line destructuring className, appended to
  the markup       everything between the fragment tags, replaced
  the story args   the line holding data, appended to


The story
---------
A story ships beside the component. It does not run here — there is no
Storybook in this repo, and nothing installs one. It runs where the package
is unpacked, and it is written to the conventions of the repo it lands in:
types imported from the vite package, a title that is the display name on
its own, and Playground last.

Default takes no arguments and shows the component as it stands. Playground
carries one argument per prop, holding the same defaults the signature does,
so every prop has a control the moment the package is unpacked. Neither
holds realistic values. The demo the component was modelled on does not
ship, so the values it was checked against are not here to copy.


What it does not carry
----------------------
No package manifest, no tooling, no test file, and no index. A shipped
folder is unpacked into a components folder that already has all of that.
