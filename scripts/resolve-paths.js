'use strict';

const path = require('path');

module.exports = function(roots) {
  return args => path.resolve.apply(path, roots.concat(args || []));
};
