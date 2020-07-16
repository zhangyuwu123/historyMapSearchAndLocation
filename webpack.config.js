const webpack = require('webpack');
var path = require('path');

module.exports = {
  mode: 'development',
  entry: './liandui1.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  }
};
