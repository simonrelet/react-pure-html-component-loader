'use strict';

const constants = require('../../constants');
const result = require('../result');

module.exports = function(ast) {
  const mapper = node => {
    if (node.name !== constants.tags.COMPONENT
      && node.name !== constants.tags.IMPORT) {
      return result.withError(
        `Only '<${constants.tags.COMPONENT}>' and '<${constants.tags.IMPORT}>' `
        + `are allowed as root elements`,
        node.meta.line
      );
    }
    return result.empty();
  };

  return ast.map(mapper)
    .reduce(result.reducer, result.empty());
};
