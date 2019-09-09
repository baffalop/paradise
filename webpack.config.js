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
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ],
  },
}
