'use strict';

const extractImports = require('./extract-imports');
const extractTemplates = require('./extract-templates');
const renderTemplates = require('./render-templates');

function astToReact(ast) {
  const imports = extractImports(ast.roots);
  const templates = extractTemplates(ast.roots);
  const renderedTemplates = renderTemplates({
    namedNodes: templates.namedNodes,
    defaultNode: templates.defaultNode,
    tagToVar: Object.assign({}, imports.tagToVar, templates.tagToVar)
  });

  let content = `'use strict';\n\nimport React from 'react';\n`;
  content = `${content}${imports.rendered}\n`;
  content = `${content}${renderedTemplates.join('\n')}`;
  return content;
}

module.exports = astToReact;
