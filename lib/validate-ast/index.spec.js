'use strict';

const glob = require('glob');
const path = require('path');

const rules = glob.sync(path.join(__dirname, 'rules', '**', '*.spec.js'))
  .map(p => `./${path.relative(__dirname, p)}`);

describe('validate-ast', function() {
  rules.forEach(test => require(test)());
});
