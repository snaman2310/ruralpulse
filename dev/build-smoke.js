/* Builds ../_smoke.html (index.html + dev/smoke.js) and runs the headless test.
   Usage:  node dev/build-smoke.js            (build only)
           node dev/build-smoke.js --run      (build + run in Edge headless) */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const dir = __dirname;
const root = path.join(dir, '..');
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
html = html.replace('</body>', '  <script src="dev/smoke.js"></script>\n</body>');
const out = path.join(root, '_smoke.html');
fs.writeFileSync(out, html, 'utf8');
console.log('_smoke.html written');

if (process.argv.includes('--run')) {
  const edge = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  ].find(p => fs.existsSync(p));
  if (!edge) { console.log('No Chromium browser found — skipped.'); process.exit(0); }
  const dom = execFileSync(edge, [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    '--virtual-time-budget=30000', '--dump-dom',
    'file:///' + out.replace(/\\/g, '/')
  ], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
  const m = dom.match(/<pre id="results">([\s\S]*?)<\/pre>/);
  if (!m) { console.log('No results block — the test did not finish.'); process.exit(1); }
  console.log(m[1]);
  process.exit(/FAILED 0/.test(m[1]) ? 0 : 1);
}
