// Inlines style.css/fonts.css/script.js into index.html so it can be tested in a browser.
// The dc-runtime reads the component script via scriptEl.textContent, which only works
// for an inline <script>, not <script src="...">. Run this after every edit, then open
// preview.html (via a local server, not file://, since it still needs to fetch the font/runtime assets).
// Usage: node build_preview.js

const fs = require('fs');
const path = require('path');

const dir = __dirname;
let html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const fontsCss = fs.readFileSync(path.join(dir, 'fonts.css'), 'utf8');
const styleCss = fs.readFileSync(path.join(dir, 'style.css'), 'utf8');
const scriptJs = fs.readFileSync(path.join(dir, 'script.js'), 'utf8');
const effectsJs = fs.readFileSync(path.join(dir, 'effects.js'), 'utf8');

html = html.replace('<link rel="stylesheet" href="fonts.css">', '<style>' + fontsCss + '</style>');
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>' + styleCss + '</style>');
html = html.replace(
  '<script src="script.js" type="text/x-dc" data-dc-script=""></script>',
  '<script type="text/x-dc" data-dc-script="">' + scriptJs + '</script>'
);
html = html.replace(
  '<script src="effects.js"></script>',
  '<script>' + effectsJs + '</script>'
);

fs.writeFileSync(path.join(dir, 'preview.html'), html);
console.log('Wrote preview.html');
