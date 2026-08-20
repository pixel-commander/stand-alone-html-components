ADD-NEW-PROJECT
===============

What it does
------------
Starts a new project by copying the template and filling in the names, then
adds the project to the list the loader draws its nav from.

It is the first two steps of the stamp done for you. The rest of the stamp
is still yours, and the script says so when it finishes.


What it asks for
----------------
One name, dash-separated and lower case. A custom element tag must contain a
dash for a browser to accept it, so a name without one is refused.


What it writes
--------------
A folder under projects, named after the component, holding a copy of the
template with every placeholder replaced — the script renamed to the
component, the tag, the class, the class name the markup carries, and the
title. Nothing named component or ComponentName is left behind.

The template's own README does not come along. It describes how to start a
project, which is not what the new project is about.

It also adds an entry to the array in the shell, so the project appears in
the nav. A page cannot read a directory, so a project that is not in that
array does not exist as far as the loader is concerned.


What it refuses
---------------
A name that is already taken. Nothing is written and nothing is overwritten,
because a name already written is the name that stays.

A name a custom element cannot carry.


What is left to you
-------------------
The markup, the props, the position classes, the stylesheets, the demo, and
the project's own README. The stamp in the template's README is the full
list, and it is the list this script is only the beginning of.
