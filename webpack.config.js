module.exports = {
  entry: './src/app.js',
  output: {
    filename: './www/js/index.js',
  },
  resolve: {
    modules: ['./src', './node_modules']
  }
}
