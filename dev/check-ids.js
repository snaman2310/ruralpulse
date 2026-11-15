/* Cross-check every #id referenced in app.js against index.html.
   Usage: node dev/check-ids.js */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

const htmlIds = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
const jsIds = [...new Set([...js.matchAll(/\$\('#([A-Za-z0-9_-]+)'/g)].map(m => m[1]))];

const RUNTIME = ['staffCodeInput', 'newUpi', 'upiPin', 'noteInput', 'rejectReason', 'rejectNote', 'inspectImg'];
const missing = jsIds.filter(i => !htmlIds.includes(i) && !RUNTIME.includes(i) && !i.startsWith('faq-'));

const dupes = htmlIds.filter((v, i) => htmlIds.indexOf(v) !== i);

console.log('ids in index.html      :', htmlIds.length);
console.log('ids referenced in app.js:', jsIds.length);
console.log('\nMISSING (static ids)   :', missing.length ? missing.join(', ') : 'none');
console.log('DUPLICATE ids in HTML  :', dupes.length ? dupes.join(', ') : 'none');

const externalRefs = [...html.matchAll(/(?:src|href)="(https?:\/\/[^"]+)"/g)].map(m => m[1]);
console.log('\nexternal network refs  :', externalRefs.length ? externalRefs.join(', ') : 'none (fully offline)');

process.exit(missing.length || dupes.length ? 1 : 0);
