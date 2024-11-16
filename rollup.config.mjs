// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json'));

export default [
  {
    input: 'src/index.js',
    output: {
      file: pkg.main,
      name: 'venn',
      format: 'umd',
    },
    external: Object.keys(pkg.peerDependencies || {}),
    plugins: [commonjs(), resolve(), babel({ babelHelpers: 'runtime' })],
  },
  {
    input: 'src/index.js',
    output: {
      file: pkg.module,
      format: 'esm',
    },
    external: Object.keys(pkg.peerDependencies || {}).concat(Object.keys(pkg.dependencies || {})),
    plugins: [commonjs(), resolve()],
  },
];
