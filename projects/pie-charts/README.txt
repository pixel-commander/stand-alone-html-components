PIE-CHARTS
==========

What it does
------------
Draws one circular chart from a list of groups, as a filled pie or as a
donut with the middle left open. Every group becomes one slice, sized by its
share of the total and filled with the colour the group carried.

The chart is drawn to the size of the container it sits in. The container is
measured, the smaller of its two dimensions decides the diameter, and the
circle is centred in the space that is there. The container is watched as
well as measured, so a container that changes size gets a chart redrawn to
match it.


The props
---------
data          the groups, each one a group name, a value, and a colour. The
              values are not percentages and do not have to add up to
              anything — each one is taken as a share of their total. A group
              with no value takes no slice. An empty list draws nothing.

donut         whether the middle is left open. It is on unless it is turned
              off, so a chart that says nothing about it is a donut. Turned
              off, every slice runs to the centre and the chart is a full
              pie.

handleClick   what to call when a slice is clicked, handed the group that was
              clicked. It is optional. Hovering and selecting a slice
------------------------------
A slice reacts to the pointer by changing thickness rather than by changing
colour or moving. It grows from both edges at once, so it stays where it is on
the circle and only gets heavier.

The slice under the pointer reaches a little further out and has its hole
pulled a little further in. Every other slice does the opposite by the same
amount, pulling its rim in and pushing its hole out, so it reads as thinner
beside the one being pointed at. Taking the pointer away puts every edge back.
The amounts are small on purpose: the chart should look like it leaned, not
like it jumped. The change is eased rather than snapped.

The circle is drawn a shade inside the space it was given, so a slice that
grows still has somewhere to grow into and never runs off the edge.

Selecting looks the same as hovering, because it is the same change. Clicking
a slice thickens it and thins the others, and holds them that way after the
pointer leaves. The unselected ones are also greyed, which hovering does not
do — that is the one difference between the two.

Clicking the slice that is already selected clears the whole thing. Every mark
comes off, every hole goes back, and the chart is the way it loaded. Nothing
is ever left half-marked.

Hovering while something is selected shows the hovered slice, and leaving
returns to the selected one rather than to nothing.

Either way the click is passed on, so a caller hears about the slice that was
clicked whether that click selected it or cleared it.


How a slice is worked out
-------------------------
One function does the whole of it, and it is kept apart from the component.
It is handed the groups, whether a donut was asked for, and the measured
size, and it hands back one record per group carrying the group name, the
colour, and the path to draw. It decides the geometry and nothing else — it
touches no elements and reads nothing off the page.

Slices start at the top and run clockwise. A pie slice is a wedge drawn from
the centre out to the rim and back. A donut slice is the same span drawn
twice, out along the rim and back along an inner circle, so the middle is
never covered.

The component does no geometry of its own. It measures, asks for the slices,
and draws one path per slice with the group on it and the colour filling it.


What the demo shows
-------------------
Three machine states — running, idle, and fault — holding shares of an hour,
each with the colour that state is usually drawn in. It sets no donut, so the
demo is the default: a donut. Its click handler reports the group and the
value it was given, which is how the click is checked.


What it does not do yet
-----------------------
A pie shows no thickness change. The three sizes are three positions for the
hole, and a pie has no hole, so hovering and selecting a pie slice greys it
and nothing more.

A single group holding the whole total draws nothing. A slice that spans the
entire circle starts and ends in the same place, and an arc between one point
and itself has no length.

There is no legend and no label.
