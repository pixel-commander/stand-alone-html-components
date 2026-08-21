CONVERT-TO-TAILWIND
===================

What it does
------------
Reads one stylesheet and writes what its rules would be as utility classes.
It is a reading, not an edit. The stylesheet it read is left exactly as it
was, and no markup is touched.

It is handed the file to read and the file to write, both by name. Neither is
guessed at and neither is assumed to sit inside a project, so it converts a
stylesheet from anywhere to anywhere.


What it writes
--------------
One record per selector, carrying the selector as it was written, the classes
that stand for its declarations, and whatever could not be converted.

The selectors are kept as they were. A rule written against a child, an
attribute, or a class holds that shape in the output, because the shape is
how a person finds the rule again.

A selector declared more than once comes back once, with the declarations
gathered. Two rules writing to the same name are one decision spread over two
places, and reading them apart would only invite putting half of it back.


What it hands back
------------------
Every declaration with no utility to stand for it. Rather than being dropped,
it travels in the file beside the selector it came from.

That is the whole reason to read the output rather than trust it. A converter
that quietly skips what it cannot express looks finished and is not, and the
gap does not show until something is wrong on the page. Grid areas and the
background and border shorthands are the ones that come up here.


What it refuses
---------------
An output file that already exists. Nothing is written and nothing is
overwritten, because a name already written is the name that stays.

A stylesheet that is not there.


What it does not decide
-----------------------
Which classes belong on which element. A selector is not an element — one
rule can dress many tags, and one tag can be dressed by many rules. Only the
markup says which, and the markup is not read here.

It also does not know which classes are load-bearing. A class in this repo is
often doing two jobs at once, dressing an element and giving the script a way
to find it. Moving the dressing into utilities does not free the name, and
nothing here can tell the two apart.
