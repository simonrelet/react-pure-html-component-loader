/* eslint no-console:"off" */
'use strict';

const minimistOptions = {
  alias: { port: 'p' },
  default: { port: 8080 }
};

const argv = require('minimist')(process.argv.slice(2), minimistOptions);
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const webpackConfig = require('./webpack.config.js');

let demo = path.join('demo', 'todo-list');
if (argv._.length === 1) {
  demo = argv._[0];
}

const config = webpackConfig({
  port: argv.port,
  outputDir: path.resolve(),
  entry: path.join(process.env.PWD, demo, 'index.jsx'),
  html: path.join(__dirname, 'index.html')
});

const devServerOptions = {
  stats: { colors: true }
};

new WebpackDevServer(webpack(config), devServerOptions)
  .listen(argv.port, '0.0.0.0', err => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
