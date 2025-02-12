# Example survey pages
- New ES6 modules have to be run from a local web server to fix CORS errors.
- We'll use `http-server` for this.
- Example HTML pages have to be copied from `./Example Pages/` folder into `./UI/_example-pages/` folder.
- Edit the file paths for CSS/JavaScript:
```
<link rel="stylesheet" type="text/css" href="css/index.css" />

<script defer type="module" src="javascript/index.js"></script>
```

## Generate build assets (e.g. CSS/JS) and run local web server
- From terminal prompt, enter `cd UI`.
- Enter `npm run localserver` to generate and copy up-to-date CSS/JavaScript
    - The `CSS` folder will also include any Parcel-bundled font files & any images that are used as CSS background images.

## Access local server
- Open http://127.0.0.1:8080 to see webpage.
