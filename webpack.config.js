const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: {
    'skeletor': path.join(__dirname, 'src/index.js'),
    'sandbox': path.join(__dirname, 'src/sandbox/index.js'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.js/,
      exclude: /(node_modules|bower_components)/,
      use: [{
        loader: 'babel-loader'
      }]
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/sandbox/index.html',
    }),
    new CleanWebpackPlugin(['dist']),
  ],
  stats: {
    colors: true
  },
}