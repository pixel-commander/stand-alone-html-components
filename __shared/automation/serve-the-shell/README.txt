SERVE-THE-SHELL
===============

What it does
------------
Serves the repo over http so the loader can reach the shipper. A page opened
from the file system cannot start a process, so the ship control in the shell
has nothing to call until something is listening. This is that something.

It does two things and no more. It hands out the files of the repo as they
are on disk, and it answers one request by running the shipper on one project
and returning what the shipper printed.

Nothing is compiled, bundled, or watched. The files served are the files that
are there, read fresh on every request, so a change shows up on reload.


How the shipping request works
------------------------------
The shell sends the name of the project currently selected. The name is
checked against the shape a project name is allowed to take, and a name that
fails is refused without anything being run.

A name that passes is handed to the shipper as an argument, and the shipper
decides everything from there. What comes back is exactly what the shipper
printed — the blocked report when a project is not ready, and the written and
zipped lines with the decisions left to you when it is. The status says which
of the two it was.

The shipper is not reimplemented here and nothing it decides is second
guessed. This starts it and carries its words back.


What it refuses
---------------
A request for a file outside the repo. Paths are resolved before anything is
read, and one that lands outside is refused.

A project name that is not one — anything that is not lower case, dash
separated, and starting with a letter. The shipper is never started for it.


What it does not do
-------------------
It does not write anything. Every file that appears from a shipping request is
written by the shipper, into the folder the shipper decides on.

It does not change how a component runs. A component is still a page that
opens on its own with nothing installed first, and serving the repo does not
make the shell part of any component.
