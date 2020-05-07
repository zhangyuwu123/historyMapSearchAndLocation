const webpack = require('webpack');

module.exports = {
  entry: './main_local.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
};
