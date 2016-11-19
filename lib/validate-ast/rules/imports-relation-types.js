'use strict';

const constants = require('../../constants');
const result = require('../result');

const importAttrs = constants.attributes.import;
const types = Object.keys(importAttrs.types)
  .map(k => importAttrs.types[k]);
const typesStr = types.map(t => `'${t}'`).join(', ');

function hasValidRelationType(node) {
  const importType = node.attrs[importAttrs.TYPE];

  if (types.some(type => type === importType)) {
    return result.empty();
  }

  return result.withError(
    `Import type '${importType}' is not valid, should be one of: ${typesStr}`,
    node.meta.line
  );
}

module.exports = function(ast) {
  return ast
    .filter(node => node.name === constants.tags.IMPORT)
    .map(hasValidRelationType)
    .reduce(result.reducer, result.empty());
};
