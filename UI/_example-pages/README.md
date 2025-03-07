# Example survey pages
- New ES6 modules have to be run from a local web server to fix CORS errors.
- We'll use `http-server` for this.
- Example HTML pages have to be copied from `./Example Pages/` folder into `./UI/_example-pages/` folder, and renamed to `index.html`.

## Generate build assets (e.g. CSS/JS) and run local web server
### Testing against unminified DEV mode assets
- Edit the file paths in `./UI/_example-pages/index.html` for CSS/JavaScript:
```
<link rel="stylesheet" type="text/css" href="index.css" />

<script defer type="module" src="index.js"></script>
```
- From terminal prompt, enter `cd UI`.
- Enter `npm run localserver-dev` to generate and copy up-to-date CSS/JavaScript.

> NOTE: This command first starts the Parcel server, bundling the CSS/JavaScript. When Parcel has started (you'll see a "Built in..." console message), hit `CTRL-C` to terminate Parcel. This will then enable http-server to complete its setup, allowing you to view the webpage.

### Testing against minified PROD mode assets
- Edit the file paths in `./UI/_example-pages/index.html` for CSS/JavaScript:
```
<link rel="stylesheet" type="text/css" href="build/css/index.css" />

<script defer type="module" src="build/javascript/index.js"></script>
```
- From terminal prompt, enter `cd UI`.
- Enter `npm run localserver-prod` to generate and copy up-to-date CSS/JavaScript.

> NOTE: At the present time JavaScript -> TypeScript mapping does not working correctly in the minified version.

## Access local server
- Open http://127.0.0.1:8080 to see webpage.
