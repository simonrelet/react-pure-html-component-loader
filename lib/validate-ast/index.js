'use strict';

const result = require('./result');

const noImportInTemplates = require('./rules/no-imports-in-templates');
const noTemplateNesting = require('./rules/no-template-nesting');
const rootElements = require('./rules/root-elements');
const singleDefaultTemplate = require('./rules/single-default-template');
const templateImportsNesting = require('./rules/template-imports-nesting');
const importsRelationTypes = require('./rules/imports-relation-types');

function checkAst(ast) {
  const rules = [
    rootElements,
    singleDefaultTemplate,
    noTemplateNesting,
    noImportInTemplates,
    templateImportsNesting,
    importsRelationTypes
  ];

  return rules
    .map(rule => rule(ast))
    .reduce((acc, res) => acc.concat(res), result.empty())
    .build();
}

module.exports = checkAst;
