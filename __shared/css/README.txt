HOUSE_CSS — the shared layer. Two files, and neither one is a component.

grid.css   the canonical grid. Copied verbatim from the owner's file; the only
           change is that nothing was changed. Every structural layout in this
           project is one of these classes: .grid with side-l / side-r / sides /
           with-header / with-footer / holy-grail / scroll-y / inherit, the
           gap-* and pad-* atoms, .full, and data-area placement.

           A component that needs a template these classes do not cover writes
           it in its OWN css file. It never lands here, and it never becomes a
           shared utility.

demo.css   chrome for the atom demos only. `demo-atom` gives a bare skin a
           box to be seen in, because an atom has no size of its own. Nothing
           in atoms/ or elements/ may depend on this file.
