import { readFile, writeFile } from 'node:fs/promises';

const html = await readFile('dist/dev.html', 'utf8');
const cssMatch = html.match(/<link[^>]+href="([^"]+\.css)"[^>]*>/);
const jsMatch = html.match(/<script[^>]+src="([^"]+\.js)"[^>]*><\/script>/);
if (!cssMatch || !jsMatch) throw new Error('Could not locate bundled CSS or JavaScript in dist/dev.html');
const cssPath = `dist/${cssMatch[1].replace(/^\.\//, '')}`;
const jsPath = `dist/${jsMatch[1].replace(/^\.\//, '')}`;
const [css, js] = await Promise.all([readFile(cssPath, 'utf8'), readFile(jsPath, 'utf8')]);
const standalone = html
  .replace(cssMatch[0], () => `<style>${css}</style>`)
  .replace(jsMatch[0], () => `<script type="module">${js}</script>`)
  .replace(/<script type="module">/, '<script type="module">\n');
await writeFile('index.html', standalone);
console.log('Wrote standalone game to index.html');
