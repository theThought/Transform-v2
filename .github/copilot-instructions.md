# Copilot Instructions for Transform-v2

## Project Overview
- **Transform-v2** refactors survey UI for Healthcare and PassiveObservation, using ES6/TypeScript, HTML Web Components, and vanilla CSS. All refactored code is in the `UI/` folder.
- The architecture centers on modular components, atomic design principles, and modern build tooling (Parcel, Storybook).

## Key Workflows
- **Build for production:**
  - `cd UI`
  - `npm run build` (compiles/minifies CSS/JS, bundles assets)
- **Local development:**
  - `npm start` (Parcel watches files, enables HMR)
  - `npm run storybook` (launches Storybook in parallel)
- **Linting:**
  - Run `npm run prepare` once after cloning to set up Husky pre-commit hooks.
  - Linting is enforced via ESLint, Stylelint, and Prettier. See `.eslintrc.js`, `.stylelintrc`, `.prettierrc`.
- **Testing example pages:**
  - DEV: `npm run localserver-dev` (unminified assets)
  - PROD: `npm run localserver-prod` (minified assets)
  - Example HTML pages are in `UI/_example-pages/`.

## Build Artifacts & Asset Linking
- Build output is configured via `--dist-dir` in `package.json` and referenced in scripts like `UI/scripts/static-assets-move.js`.
- To link build assets in surveys:
  ```html
  <link rel="stylesheet" href="/path/to/build/folder/stylesheets/index.css">
  <script defer type="module" src="/path/to/build/folder/javascript/index.js"></script>
  <script defer nomodule src="/path/to/build/folder/javascript/legacy.js"></script>
  ```

## Storybook Integration
- Storybook uses environment variables for asset paths, set in `.env.development` and `.env.production`.
- To publish Storybook: `npm run publish-storybook` (output in `storybook-static/`).
- Local test: `npx http-server ./storybook-static`
- GitHub Pages deploy uses `.github/workflows/static.yml`.

## Conventions & Patterns
- **Browserslist** config in `package.json` determines transpilation targets. Run `npx browserslist` to view supported browsers.
- **TypeScript:** Requires a `tsconfig.json` (even empty) for editor integration.
- **Polyfills:** Separate bundle for legacy browser support, see `src/javascript/config/browser-supports-features.ts`.
- **Linting:** VSCode must be opened from the project root for correct linting. Custom `.vscode/settings.json` sets working directory.
- **Assets:** Fonts, images, and favicons are bundled and paths preserved.

## Troubleshooting
- If HMR or bundling fails:
  - Kill Parcel process (`CTRL+C`)
  - Delete `.parcel-cache`
  - Restart with `npm start`

## References
- Main code: `UI/`
- Example pages: `UI/_example-pages/`
- Build scripts: `UI/scripts/`, `package.json`
- Lint configs: `.eslintrc.js`, `.stylelintrc`, `.prettierrc`, `.vscode/settings.json`
- Storybook: `.storybook/`, `.env.*`, `storybook-static/`

---

**Feedback requested:**
- Are any workflows, conventions, or integration points unclear or missing?
- Please specify any additional patterns or files that should be documented for future AI agents.
