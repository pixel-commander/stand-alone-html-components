machine-overview-grid
=====================

A titled panel of machine readings.

The wrapper is a grid of two columns and two rows. The narrow first column
holds an icon on the top row and nothing on the bottom, leaving the readings
indented under the title rather than under the icon. The wide second column
holds the header on the top row and the readings beneath it.

The header is its own two-column grid: the title takes the free space on the
left and the value is pushed to the right edge.

The readings are a three-column grid — name, target, actual — with a heading
row above them reading Target and Actual Value. The name column takes the
free space; the other two size to their contents and are right-aligned, with
the actual value carrying the emphasis. Cells are spaced by their own
padding rather than a grid gap, so the rule under the heading row runs
unbroken across the full width.


Props
-----
data    an array of readings, each with a name, a target, and an actual
        value. Empty by default, which leaves just the heading row.
icon    an image placed inside the circle at the top left. Unset leaves
        the circle empty.
color   the circle's fill. Falls back to the stylesheet's blue when unset.
title   the header's left-hand text.
value   the header's right-hand text. Empty by default.

All five are set as properties, not attributes — title in particular, so it
does not turn into a browser tooltip. Each one re-renders on assignment.


Demo
----
The page mounts the real component and fills it with the subsystem readings
it was modelled on. Two icons sit alongside it for the demo to draw from,
both plain white line drawings meant to read against a coloured circle.


React
-----
This is shaped for a port. The five props carry over unchanged, the render
becomes the returned markup, and there is no internal state to move — the
component draws only what it is handed.
