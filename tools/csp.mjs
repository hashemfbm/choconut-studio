import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';

const indexFile = new URL('../index.html',import.meta.url);
const source = readFileSync(indexFile,'utf8');

function inlineHashes(tag) {
  const blocks = [...source.matchAll(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`,'g'))];
  if (!blocks.length) throw new Error(`No inline ${tag} found in index.html`);
  return blocks.map(([,body]) => {
    const hash = createHash('sha256').update(body.replace(/\r\n?/g,'\n')).digest('base64');
    return `'sha256-${hash}'`;
  }).join(' ');
}

const policy = [
  "default-src 'none'",
  `script-src ${inlineHashes('script')}`,
  "script-src-attr 'none'",
  `style-src ${inlineHashes('style')}`,
  "style-src-attr 'unsafe-inline'",
  "img-src 'self' data: blob:",
  'font-src data:',
  "worker-src 'self'",
  "manifest-src 'self'",
  "base-uri 'none'",
  "form-action 'none'",
].join('; ');

const meta = /<meta http-equiv="Content-Security-Policy" content="[^"]*">/;
if (!meta.test(source)) throw new Error('Missing CSP meta tag in index.html');
const updated = source.replace(meta,`<meta http-equiv="Content-Security-Policy" content="${policy}">`);
if (process.argv.includes('--write')) {
  writeFileSync(indexFile,updated);
} else if (updated !== source) {
  throw new Error('CSP hashes are stale. Run node tools/csp.mjs --write.');
}
console.log('Embedded script and style hashes match the security policy.');
