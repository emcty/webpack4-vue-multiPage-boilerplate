'use strict';

module.exports = {
  inputBase: 'src',
  outputBase: 'dist',
  prod: {
    publicPath: '/assets/'
  },
  dev: {
    publicPath: '/',
    port: 8091,
    proxyToServer: false,
    mock: {
      contentBase: './mock',
      port: 8092
    }
  }
}