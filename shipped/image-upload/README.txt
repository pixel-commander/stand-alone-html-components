image-upload
============

A wrapper element that takes an image from the user and shows it.

The wrapper is a grid of three stacked rows: a header, the image, and the
link. Each row sizes to what it holds, so the header is absent unless given
text, and with no image chosen the middle row collapses to nothing and the
remaining rows sit centered. Once an image is chosen the middle row takes
the leftover height and the image scales to fit it, keeping its proportions
and never pushing the link off the bottom.

The link reads "click here select an image". Clicking it opens the system file
browser, filtered to images. Picking one and closing the box displays it.
The link stays put beneath, so picking again replaces the image. Cancelling
the box changes nothing.

While an image is showing, a small x sits in the top right corner of it.
Clicking it unselects the image and returns the component to its empty
state, ready to pick again — including the same file a second time. The x is
not drawn while there is nothing to remove.

Everything the component draws lives inside the wrapper. The host page
supplies nothing but the tag.


Props
-----
handleUpload  a function, called with the chosen file each time one is
              picked. Optional — without it the component still previews.
header        text for the top row. Empty by default, and the row is not
              drawn at all when empty.
label         the link's text. Defaults to "click here select an
              image".
src           the image being shown. Set by the component when a file is
              picked, and settable from outside to preview something up
              front.


Demo
----
The page mounts the real component and assigns handleUpload, which logs the
chosen file's name, type, and size to the console.


React
-----
This is shaped for a port. The four props become the component's props
unchanged, src becomes the one piece of state, and the file input's change
handler becomes the one event handler. The object URL is revoked before a
new one replaces it, which becomes cleanup on unmount.
