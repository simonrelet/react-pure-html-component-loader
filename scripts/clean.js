/* eslint no-console: "off" */
'use strict';

const del = require('del');
const path = require('path');

function absPath() {
  return path.join(__dirname, '..', ...arguments);
}

const filesToDelete = [ absPath('dist') ];

del(filesToDelete)
  .then(files => {
    if (files.length > 0) {
      files = files.map(file => path.relative(absPath(''), file));
      console.log(`Deleted paths:\n\n  ${files.join('\n  ')}\n`);
    } else {
      console.log('Already clean');
    }
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
