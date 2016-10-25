/* eslint no-console: "off" */
'use strict';

const del = require('del');
const path = require('path');

const resolve = require('./resolve-paths')([ __dirname, '..' ]);

const filesToDelete = [ 'dist' ];

del(filesToDelete)
  .then(files => {
    if (files.length > 0) {
      files = files.map(file => path.relative(resolve(), file));
      console.log(`Deleted paths:\n\n  ${files.join('\n  ')}\n`);
    } else {
      console.log('Already clean');
    }
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
