const path = require('path')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src/paradise.js'),
  output: {
    path: path.resolve(__dirname, 'www/js'),
    filename: 'index.js',
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
}
