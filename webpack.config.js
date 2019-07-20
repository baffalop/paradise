module.exports = {
  entry: './src/paradise.js',
  output: {
    filename: './www/js/index.js',
  },
  resolve: {
    modules: ['./src', './node_modules']
  }
}
