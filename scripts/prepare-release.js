/* eslint no-console: "off" */
'use strict';

const fs = require('fs-promise');
const glob = require('glob');
const path = require('path');
const omit = require('lodash.omit');

function absPath() {
  return path.join(__dirname, '..', ...arguments);
}

const pkgOmit = [
  'private',
  'scripts',
  'eslintConfig',
  'devDependencies'
];

const otherFilesToCopy = [
  absPath('LICENSE'),
  absPath('README.md')
];

function copyFile(options) {
  return fs.readFile(options.src, 'utf8')
    .then(content => fs.outputFile(options.dst, content));
}

function copyAllSources() {
  const sources = glob.sync(absPath('@(lib|loader)/**/*.js'), { ignore: '**/*.spec.js' })
    .concat(otherFilesToCopy);
  const copySources = sources.map(src => copyFile({
    src,
    dst: absPath('dist', path.relative(absPath(''), src))
  }));
  const copyPackage = fs.readJson(absPath('package.json'))
    .then(pkg => fs.writeJson(absPath('dist', 'package.json'), omit(pkg, pkgOmit)));

  return Promise.all(copySources.concat([ copyPackage ]));
}

fs.ensureDir(absPath('dist'))
  .then(copyAllSources)
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
