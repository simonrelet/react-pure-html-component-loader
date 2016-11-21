'use strict';

const constants = require('../../constants');
const result = require('../result');

function noComponentNesting(children) {
  const mapper = child => {
    if (child.name === constants.tags.COMPONENT) {
      return result.withError(
        `A '<${constants.tags.COMPONENT}>' cannot be nested`,
        child.meta.line
      );
    }
    return noComponentNesting(child.children);
  };

  return children.map(mapper)
    .reduce(result.reducer, result.empty());
}

module.exports = function(ast) {
  return ast.map(root => noComponentNesting(root.children))
    .reduce(result.reducer, result.empty());
};
