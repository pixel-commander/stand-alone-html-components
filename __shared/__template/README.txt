THE TEMPLATE — starting a new project
=====================================

What this is
------------
A copy-me starting point. Copying it yields a page that links one stylesheet
and one script of its own and nothing else — no shell assets, no shared
theme. It is not a base to inherit from, and nothing here is imported by a
project that has been copied out of it.

What it carries is the shape every component in this repo already shares,
written out once so it does not have to be typed again. The shape is the one
the conversion process expects, so a component that starts here is a
component that converts mechanically.


The stamp
---------
Copying the folder is the first step, not the only one. A new project is
complete when all of the following are true.

1. THE FOLDER
   The template folder is copied into projects and the copy is named after
   the component. Names are dash-separated and lower case, matching the ones
   already there.

2. THE PLACEHOLDERS
   The template ships three placeholder names, and every one of them is
   replaced. This is the one place renaming is expected rather than
   forbidden.

     component.js        the script file, renamed to the component
     component-name      the tag, in the markup and in the define call
     ComponentName       the class
     .component-name     the class name the element adds to itself

   The word component in the title is replaced too. Nothing named component
   or ComponentName is left behind.

3. THE MARKUP
   The empty template literal is filled with the component's structure,
   written as tags. It is not assembled from createElement calls. What the
   script fills in is left empty in the markup and set in render.

4. THE PROPS
   The single value field is replaced by one private field per prop, each
   with a default, each with a getter and a setter, and each setter coercing
   with || and calling render. A component with no props keeps none of it.

5. THE POSITION CLASSES
   Anything styled for where it sits — third in a row, first row, last of
   its kind — is given a class in render rather than selected by counting
   children in the stylesheet.

6. THE STYLESHEETS
   style.css dresses the host page so the component has a frame to fill when
   opened on its own. project.css carries the component itself. The first
   belongs to the demo and does not convert; the second does.

7. THE DEMO
   script.js mounts the component and assigns the props it was modelled on,
   with realistic values rather than placeholders. It is the fixture the
   conversion is checked against. It does not convert, and nothing the
   component needs may live in it.

8. THE README
   The project gets its own README describing what it does, what props it
   takes, and what the demo shows. It describes functionality only. Paths
   belong in PATHS.txt.

9. THE LIST
   The loader cannot read a directory, so the project is added to the array
   in the shell before it appears. An entry carries the name to show and the
   path to load.

10. PATHS
    A project that adds anything beyond the copied files — an icons folder,
    a second script — is a project whose paths are recorded.


What is not done here
---------------------
No tooling is added, no package manifest is written, and nothing is hoisted
into the shared area because a second component wants it too. A project
ships on its own and carries everything it needs.
