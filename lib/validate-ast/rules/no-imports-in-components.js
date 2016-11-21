'use strict';

const constants = require('../../constants');
const result = require('../result');

function noImportInComponents(node) {
  const mapper = child => {
    if (child.name === constants.tags.IMPORT) {
      return result.withError(
        'Imports should be at the top level of the file',
        child.meta.line
      );
    }
    return noImportInComponents(child);
  };

  return node.children
    .map(mapper)
    .reduce(result.reducer, result.empty());
}

module.exports = function(ast) {
  return ast
    .filter(node => node.name === constants.tags.COMPONENT)
    .map(noImportInComponents)
    .reduce(result.reducer, result.empty());
};
