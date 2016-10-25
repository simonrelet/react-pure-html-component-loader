/* eslint no-console: "off" */
'use strict';

const fs = require('fs-promise');
const glob = require('glob');
const omit = require('lodash.omit');

const resolve = require('./resolve-paths')([ __dirname, '..' ]);

const pkgOmit = [
  'private',
  'scripts',
  'eslintConfig',
  'devDependencies'
];

const otherFilesToCopy = [
  'LICENSE',
  'README.md',
  'ROADMAP.md'
];

function copyFile(options) {
  return fs.readFile(options.src, 'utf8')
    .then(content => fs.outputFile(options.dst, content));
}

function copyAllSources() {
  const sources = glob.sync('@(lib|loader)/**/*.js', { ignore: '**/*.spec.js' })
    .concat(otherFilesToCopy);

  const copySources = sources.map(src => copyFile({ src, dst: `dist/${src}` }));
  const copyPackage = fs.readJson('package.json')
    .then(pkg => fs.writeJson('dist/package.json', omit(pkg, pkgOmit)));

  return Promise.all(copySources.concat([ copyPackage ]));
}

fs.ensureDir(resolve([ 'dist' ]))
  .then(copyAllSources)
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
