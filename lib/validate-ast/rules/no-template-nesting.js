'use strict';

const constants = require('../../constants');
const result = require('../result');

function noTemplateNesting(children) {
  const mapper = child => {
    if (child.name === constants.tags.TEMPLATE) {
      return result.withError(
        `A '<${constants.tags.TEMPLATE}>' cannot be nested`,
        child.meta.line
      );
    }
    return noTemplateNesting(child.children);
  };

  return children.map(mapper)
    .reduce(result.reducer, result.empty());
}

module.exports = function(ast) {
  return ast.map(root => noTemplateNesting(root.children))
    .reduce(result.reducer, result.empty());
};
