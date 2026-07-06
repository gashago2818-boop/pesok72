// Rebuilds the bundled pesok72.html from the edited index.html / style.css / fonts.css / script.js.
// Usage: node merge.js
// Reads the original bundle (for the untouched manifest/runtime wrapper) and writes pesok72_merged.html
// next to it. Rename/overwrite pesok72.html yourself once you've checked the result.

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');

const srcDir = __dirname;
const origBundle = path.join(srcDir, '..', 'pesok72.html');
const outBundle = path.join(srcDir, '..', 'pesok72_merged.html');

const bundle = fs.readFileSync(origBundle, 'utf8');
const uuidToFile = JSON.parse(fs.readFileSync(path.join(srcDir, '_uuid_to_file.json'), 'utf8'));
const fileToUuid = Object.fromEntries(Object.entries(uuidToFile).map(([u, f]) => [f, u]));

const MIME_BY_EXT = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif' };

// Pack any new images under img/ into the manifest so the single-file bundle stays self-contained.
const imgDir = path.join(srcDir, 'img');
const newManifestEntries = {};
if (fs.existsSync(imgDir)) {
  for (const fname of fs.readdirSync(imgDir)) {
    const rel = 'img/' + fname;
    if (fileToUuid[rel]) continue; // already packed in a previous run
    const ext = path.extname(fname).toLowerCase();
    const mime = MIME_BY_EXT[ext];
    if (!mime) continue;
    const bytes = fs.readFileSync(path.join(imgDir, fname));
    const uuid = crypto.randomUUID();
    newManifestEntries[uuid] = {
      data: zlib.gzipSync(bytes).toString('base64'),
      compressed: true,
      mime,
    };
    fileToUuid[rel] = uuid;
    uuidToFile[uuid] = rel;
  }
}

let indexHtml = fs.readFileSync(path.join(srcDir, 'index.html'), 'utf8');
let fontsCss = fs.readFileSync(path.join(srcDir, 'fonts.css'), 'utf8');
const styleCss = fs.readFileSync(path.join(srcDir, 'style.css'), 'utf8');
const scriptJs = fs.readFileSync(path.join(srcDir, 'script.js'), 'utf8');
const effectsJs = fs.readFileSync(path.join(srcDir, 'effects.js'), 'utf8');

// Put UUIDs back in place of the relative asset paths so the bundler's blob-URL substitution works again.
for (const [file, uuid] of Object.entries(fileToUuid)) {
  indexHtml = indexHtml.split(file).join(uuid);
  fontsCss = fontsCss.split(file).join(uuid);
}

// Re-inline the extracted style/script blocks.
indexHtml = indexHtml.replace(
  '<link rel="stylesheet" href="fonts.css">',
  '<style>' + fontsCss + '</style>'
);
indexHtml = indexHtml.replace(
  '<link rel="stylesheet" href="style.css">',
  '<style>' + styleCss + '</style>'
);
indexHtml = indexHtml.replace(
  '<script src="script.js" type="text/x-dc" data-dc-script=""></script>',
  '<script type="text/x-dc" data-dc-script="">' + scriptJs + '</script>'
);
indexHtml = indexHtml.replace(
  '<script src="effects.js"></script>',
  '<script>' + effectsJs + '</script>'
);

// Escape literal "</script" sequences so the HTML parser doesn't end this <script>
// element early (the original bundle uses the same / escape for this).
const templateJson = JSON.stringify(indexHtml).replace(/<\/script/gi, '<\\u002Fscript');

const marker = '<script type="__bundler/template">';
const start = bundle.indexOf(marker);
if (start === -1) throw new Error('missing __bundler/template tag in ' + origBundle);
const contentStart = start + marker.length;
// Original content begins with a leading newline before the JSON string; find the
// real closing tag by locating the first unescaped "</script>" after that content.
const contentEnd = bundle.indexOf('</script>', contentStart);

let newBundle = bundle.slice(0, contentStart) + '\n' + templateJson + bundle.slice(contentEnd);

// Merge any newly-packed images into the manifest tag so the bundle stays self-contained.
if (Object.keys(newManifestEntries).length) {
  const manifestMarker = '<script type="__bundler/manifest">';
  const mStart = newBundle.indexOf(manifestMarker);
  if (mStart === -1) throw new Error('missing __bundler/manifest tag in ' + origBundle);
  const mContentStart = mStart + manifestMarker.length;
  const mContentEnd = newBundle.indexOf('</script>', mContentStart);
  const manifest = JSON.parse(newBundle.slice(mContentStart, mContentEnd));
  Object.assign(manifest, newManifestEntries);
  newBundle = newBundle.slice(0, mContentStart) + JSON.stringify(manifest) + newBundle.slice(mContentEnd);

  // Persist the updated mapping so a re-run recognizes these images as already packed.
  fs.writeFileSync(path.join(srcDir, '_uuid_to_file.json'), JSON.stringify(uuidToFile, null, 2));
}

fs.writeFileSync(outBundle, newBundle);
console.log('Wrote', outBundle, Object.keys(newManifestEntries).length ? `(packed ${Object.keys(newManifestEntries).length} new image(s))` : '');
