// rollup.config.js
export default {
  input: 'src/index.js',
  output: {
    file: 'build/axon.build.js',
    format: 'umd',
    name: 'Axon'
  }
};