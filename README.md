# Transform-v2
A refactoring of the Transform project moving it to a more modern HTML implementation

This is an Ipsos project for the Transformation of the look and feel of surveys for Healthcare.  The solution is also used by PassiveObservation.

The purpose of this project is to refactor v1, using ES6/TypeScript, HTML Web Components, vanilla CSS, and better implementing atomic design principles. All refactored code can be found in the `UI` folder.

## TBC
- `npx browserslist` - what Safari versions do we need to support?
- Fonts:
    - Do we need so many font variants? Currently, only a subset of the WOFF fonts have been defined in the new CSS.
    - Do we need to fetch from Google too, or just use local fonts?
- Images in `UI/src/static/images/` folder:
    - Are they only used for CSS backgrounds?
    - Or are some used in HTML `<img>` tags?
- [Do we need so many favicons](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs)?
- Define naming convention for "primitive" design tokens, align with Figma, and implement automatic export:
    - See [related ClickUp task POC](https://app.clickup.com/t/8696gvh4k)
- Implement new CSS theming mechanism with "whitelabel" default theme:
    - See [UI Boilerplate theming with Parcel + Storybook](https://github.com/basher/Web-UI-Boilerplate).

## TODO
- Once refactor is completed, delete the following:
    - `Survey` and `Storybook` folders.
    - `UI/src/css/shame.css` and its import inside `UI/src/css/index.css`.
    - All references to the old Survey CSS in `UI/.storybook/preview-head.html`.
