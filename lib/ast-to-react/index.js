'use strict';

const extractImports = require('./extract-imports');
const extractComponents = require('./extract-components');
const renderComponents = require('./render-components');

function astToReact(ast) {
  const imports = extractImports(ast.roots);
  const components = extractComponents(ast.roots);
  const renderedComponents = renderComponents({
    namedNodes: components.namedNodes,
    defaultNode: components.defaultNode,
    tagToVar: Object.assign({}, imports.tagToVar, components.tagToVar)
  });

  let content = `'use strict';\n\nimport React from 'react';\n`;
  content = `${content}${imports.rendered}\n`;
  content = `${content}${renderedComponents.join('\n')}`;
  return content;
}

module.exports = astToReact;
