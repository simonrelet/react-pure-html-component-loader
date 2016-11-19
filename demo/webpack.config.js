'use strict';

const HotModuleReplacementPlugin = require('webpack').HotModuleReplacementPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = function(options) {
  const hotModuleReplacementPlugin = new HotModuleReplacementPlugin();
  const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: options.html,
    filename: 'index.html',
    inject: 'body'
  });

  return {
    devtool: 'eval',

    entry: [
      `webpack-dev-server/client?http://localhost:${options.port}`,
      'webpack/hot/only-dev-server',
      options.entry
    ],

    output: {
      path: options.outputDir,
      publicPath: '/'
    },

    module: {
      loaders: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel'
        },
        {
          test: /\.jsx\.html$/,
          exclude: /node_modules/,
          loader: 'babel!react-pure-html-component'
        },
        {
          test: /\.svg$/,
          loader: 'file'
        },
        {
          test: /\.json$/,
          loader: 'json'
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          loaders: [
            'style',
            `css?camelCase&modules&importLoaders=1&localIdentName=[hash:base64:5]`,
            'sass'
          ]
        }
      ]
    },

    plugins: [
      hotModuleReplacementPlugin,
      htmlWebpackPlugin
    ],

    resolveLoader: {
      alias: {
        'react-pure-html-component': path.join(__dirname, '..', 'loader', 'index')
      }
    },

    resolve: {
      root: __dirname,
      extensions: [ '', '.js', '.jsx', '.jsx.html', '.scss', '.json' ]
    }
  };
};
