/* eslint no-console: "off" */
'use strict';

const argv = require('minimist')(process.argv.slice(2), {
  alias: { verbosity: 'v' },
  default: { verbosity: 'NONE' }
});

const fs = require('fs-promise');

const htmlToReact = require('../lib');

if (argv._.length === 0) {
  console.error('Missing html file');
  process.exit(1);
}

fs.readFile(argv._[0], 'utf8')
  .then(content => Promise.resolve(htmlToReact({
    html: content,
    verbosity: argv.verbosity
  })))
  .then(res => console.log(res.react));
