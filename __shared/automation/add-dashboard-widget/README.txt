ADD-DASHBOARD-WIDGET
====================

What it does
------------
Takes one finished project and writes it into a dashboard library in the
application repo, as a component and the test beside it.

It is the other half of the arc from the one that installs into the design
system. The same project can go either way, and which way is a decision about
what the component is rather than about how it was built.


What it asks for
----------------
The component, the library it belongs in, and the repo. All three, because
none of them can be worked out from the others.

The library is asked for rather than guessed because the question of which
one a component belongs to is the whole decision. When the library named is
not there, the ones that are get listed.


What it writes
--------------
Two files, into the components folder of the library that was named. The
component, and the test that renders it with the values the demo used and
again with nothing.

Nothing else. No generator runs, no project file is written, no alias is
registered, and no tags are set. A dashboard component is a file in a library
that already exists, and it inherits everything from the library it sits in.


The name
--------
The name carries over as it was, with no prefix. A prefix belongs to the
design system, where a component is exported for anything to use. A component
here is named plainly, because it is already somewhere specific.

The props type sits beside the component and is named for it.


What it refuses
---------------
The library that holds models and stores. It has no components folder, and
one is not made for it.

A library that is not there, a component that was never built, and a name the
chosen library already has. Nothing is written when it refuses, because a name
already written is the name that stays.


What is left to you
-------------------
The prop types. They are read from what each prop was given as a default, so
a list of rows arrives as a list of records — the shape of a row only ever
existed in the demo.

Whether anything outside the library should see it. Staying internal is the
default, and an export is worth a reason written beside it.
