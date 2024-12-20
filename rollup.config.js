// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json'));

export default [
  {
    input: 'src/index.js',
    output: [{
      file: pkg.require,
      name: 'venn',
      format: 'umd',
    }, {
      file: pkg.unpkg,
      name: 'venn',
      format: 'umd',
      plugins: [terser()]
    }],
    external: Object.keys(pkg.peerDependencies || {}),
    plugins: [commonjs(), resolve(), babel({ babelHelpers: 'bundled' })],
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
