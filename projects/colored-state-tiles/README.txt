colored-state-tiles
===================

Two components. A tile that states one machine value, and a wrapper that
loops a set of them.


The tile
--------
Two stacked rows. The top row reads as the title followed by the value in
parentheses, and carries the colour it was given. The bottom row is the
label, smaller and grey.

The tile is only as wide as its widest line, so a short state and a long one
do not end up the same size.


The wrapper
-----------
It loops and nothing else. No heading, no menu, no chrome. It lays the tiles
out in a row that wraps when it runs out of room, and keeps them centred, so
a single tile sits in the middle rather than against the left edge.


Props
-----
The tile takes title, value, label, and color. The colour applies to the top
row only.

The wrapper takes data — an array of those same four fields, one entry per
tile. Empty by default.


Demo
----
The page mounts the wrapper and gives it the three states it was modelled
on: two running in green and one waiting in blue.
