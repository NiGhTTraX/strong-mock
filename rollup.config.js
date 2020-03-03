import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    // Don't know why rollup thinks lodash/isEqual is different from lodash.
    external: [...Object.keys(pkg.dependencies), 'lodash/isEqual'],
    plugins: [
      typescript({
        tsconfig: './tsconfig.build.json'
      })
    ],
    output: [{ file: pkg.main, format: 'cjs' }]
  }
];
