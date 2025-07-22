import { build } from 'esbuild';
import { join } from 'path';

const entry = join('src', 'scripts', 'main.js');
const outfile = join('public', 'assets', 'scripts', 'bundle.js');

build({
  entryPoints: [entry],
  outfile,
  bundle: true,
  minify: true,
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
