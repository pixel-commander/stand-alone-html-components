active-alarms-table
===================

A scrolling list of active alarms. The table only — no panel header, no
count, no menu.

Each alarm occupies two rows of one shared grid. The first row carries a
coloured bell, the timestamp, and a link pushed to the right edge. The
second carries the alarm's id beneath the bell and the description beneath
the timestamp, running to the right edge. A rule spans the full width below
each alarm, separating it from the next.

The bell is an image loaded from a shape file, drawn in the colour that file
carries. It is the same bell on every alarm.

The link appears only when a click handler is supplied. Clicking it hands
the whole alarm back to that handler and does not navigate.

Everything scrolls inside the table rather than the page, so the table can
sit in a fixed area and keep its bounds.


Props
-----
data        an array of alarms, each with a date, a description, and
            optionally an id. Empty by default.
handleClick called with the whole alarm when its link is clicked. Optional —
            without it no link is drawn at all.
Icon        the image used for the bell. Defaults to the red bell drawn for
            this project.
link_text   the link's text. Defaults to "Open Issue".


Demo
----
The page mounts the real component with the alarms it was modelled on. A
click handler is supplied, so the links appear and log the alarm they belong
to.
