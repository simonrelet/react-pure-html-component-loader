'use strict';

const constants = require('../../constants');
const result = require('../result');

function noImportInTemplates(node) {
  const mapper = child => {
    if (child.name === constants.tags.IMPORT) {
      return result.withError(
        'Imports should be at the top level of the file',
        child.meta.line
      );
    }
    return noImportInTemplates(child);
  };

  return node.children
    .map(mapper)
    .reduce(result.reducer, result.empty());
}

module.exports = function(ast) {
  return ast
    .filter(node => node.name === constants.tags.TEMPLATE)
    .map(noImportInTemplates)
    .reduce(result.reducer, result.empty());
};
