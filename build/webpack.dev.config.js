const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server/lib/Server');
const webpackBaseConfig = require('./webpack.base.config');
const merge = require('webpack-merge');
const config = require('./config');
const chalk = require("chalk");
const path = require('path');

module.exports = merge(webpackBaseConfig,{
  devtool: 'cheap-module-inline-source-map',
  devServer:{
    open: false,
    port: config.dev.port,
    publicPath: '/',
    contentBase: path.resolve(__dirname,'../src'),
    host: 'localhost',
    inline: true,
    historyApiFallback: {
      index: '/'
    },
    hot: true,
    compress: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});



