// Rewrites the content <script> list in index.html from js/content/*.js.
//   node tools/build-index.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'index.html');
const files = fs.readdirSync(path.join(root, 'js/content')).filter((f) => f.endsWith('.js')).sort();
const block = files.map((f) => `<script src="js/content/${f}"></script>`).join('\n');
const html = fs.readFileSync(file, 'utf8').replace(
  /(<!-- content:start[^>]*-->)[\s\S]*?(<!-- content:end -->)/,
  (m, a, b) => `${a}\n${block}\n${b}`,
);
fs.writeFileSync(file, html);
console.log(`index.html now loads ${files.length} content files`);
