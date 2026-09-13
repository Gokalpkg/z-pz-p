const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const www = path.join(root, 'www');

const files = ['index.html', 'game.js', 'style.css', 'icon.png'];
const remove = ['sw.js', 'app.webmanifest', 'server.js'];

if (!fs.existsSync(www)) fs.mkdirSync(www, { recursive: true });

for (const file of files) {
  const src = path.join(root, file);
  const dest = path.join(www, file);
  if (!fs.existsSync(src)) {
    console.warn(`skip missing: ${file}`);
    continue;
  }
  fs.copyFileSync(src, dest);
  console.log(`synced ${file}`);
}

for (const file of remove) {
  const dest = path.join(www, file);
  if (fs.existsSync(dest)) {
    fs.unlinkSync(dest);
    console.log(`removed ${file}`);
  }
}

console.log('www sync complete');
