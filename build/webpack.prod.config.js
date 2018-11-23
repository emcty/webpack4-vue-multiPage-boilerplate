const webpack = require('webpack');
const webpackBaseConfig = require('./webpack.base.config');
const merge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(webpackBaseConfig,{
  plugins: [
    new BundleAnalyzerPlugin()
  ]
});
