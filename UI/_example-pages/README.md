# Example survey pages
- New ES6 modules have to be run from a local web server to fix CORS errors.
- We'll use `http-server` for this.
- Example HTML pages have to be copied from `./Example Pages/` folder into `./UI/_example-pages/` folder.
- Edit the file paths for CSS/JavaScript:
```
<link rel="stylesheet" type="text/css" href="index.css" />

<script defer type="module" src="index.js"></script>
```

## Generate build assets (e.g. CSS/JS) and run local web server
- From terminal prompt, enter `cd UI`.
- Enter `npm run localserver` to generate and copy up-to-date CSS/JavaScript.
- Assets are automatically copied from the UI/public folder and include non-minified javascript and CSS for debugging.
## Testing against production assets
- It is possible to test against the production (minified) versions by referencing build/javascript/index.js and build/css/index.css
- At the present time JavaScript -> TypeScript mapping does not working correctly in the minified version
```
<link rel="stylesheet" type="text/css" href="build/css/index.css" />

<script defer type="module" src="build/javascript/index.js"></script>
```
## Access local server
- Open http://127.0.0.1:8080 to see webpage.
