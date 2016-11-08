'use strict';

const result = require('./result');

const noImportInTemplates = require('./no-imports-in-templates');
const noTemplateNesting = require('./no-template-nesting');
const rootElements = require('./rules/root-elements');
const singleDefaultTemplate = require('./rules/single-default-template');
const importsNesting = require('./rules/imports-nesting');

function checkAst(ast) {
  const rules = [
    rootElements,
    singleDefaultTemplate,
    noTemplateNesting,
    noImportInTemplates,
    importsNesting
  ];

  return rules
    .map(rule => rule(ast))
    .reduce((acc, res) => acc.concat(res), result.empty())
    .build();
}

module.exports = checkAst;
