const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const DEBUG = process.env.NODE_ENV === 'development';
const config = require('./config');
const inputBase = config.inputBase;
const outputBase = config.outputBase;
const entries = require("./utils").getEntries(`./src/pages/**/*/index.js`);
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

let webpackConfig = {
  mode: DEBUG ? "development" : "production",
  entry: entries,
  output: {
    path: path.resolve(__dirname,'../dist'),
    publicPath: "/",
    chunkFilename:'js/[name].js?[hash:10]'
  },
  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
    splitChunks:{
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: false,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: 'initial',
          priority: 10,
          reuseExistingChunk: false,
          test: /node_modules\/(.*)\.js/
        },

      }
    },
    namedModules: DEBUG ? true: false,
    hashedModuleIds: DEBUG ? false : true
  },
  module: {
    rules: [
      {
        test: /.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css:[
              DEBUG ? 'vue-style-loader' :  MiniCssExtractPlugin.loader,
              'css-loader',
              'postcss-loader',
            ]
          },
        }

      },
      {
        test: /.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve('./src'),
        ],
        exclude: file => (/node_modules/.test(file) && !/\.vue\.js/.test(file))
      },
      {
        test: /\.css$/,
        use: [
          {loader: DEBUG ? 'vue-style-loader' : MiniCssExtractPlugin.loader}, 
          {
            loader: `css-loader`,
            options: {
              sourceMap: true,
              modules: false,
              minimize: !DEBUG  
            }
          },
          {
            loader: 'postcss-loader',
            options: {         
              plugins: () => [
                  require('precss')(),
                  require('postcss-cssnext')(), 
              ]
            }
          }
        ]
      },
      {
        test: /\.(?:png|jpe?g|gif)$/,
        loaders: DEBUG
          ? [
              {
                loader: 'url-loader',
                options: {
                  limit: 10000,
                  name: '[name].[ext]'
                }
              }
            ]
          : [
              {
                loader: 'url-loader',
                options: {
                  limit: 10000,
                  name: '[name]-[hash:10].[ext]'
                }
              },
              {
                loader: 'image-webpack-loader',
                options: {
                  mozjpeg: {
                    progressive: true,
                    quality: 65
                  },
                  optipng: {
                    enabled: false,
                  },
                  pngquant: {
                    quality: '65-90',
                    speed: 4
                  },
                  gifsicle: {
                    interlaced: false,
                  },
                }
              }
            ]
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: DEBUG ? "css/[name].css" : "css/[name].css?[hash:10]",
    }),
    new VueLoaderPlugin(),
  ],
};

Object.keys(entries).forEach(function(name){
  let plugin =  new HtmlWebpackPlugin({
    filename: `${name}.html`,
    template: './src/pages/app/template.html',
    chunks: ['manifest', 'vendor', name]
  });
  webpackConfig.plugins.push(plugin);
});

module.exports = webpackConfig;


