'use strict';

const result = require('./result');

const componentImportsNesting = require('./rules/component-imports-nesting');
const noComponentNesting = require('./rules/no-component-nesting');
const noImportInComponents = require('./rules/no-imports-in-components');
const rootElements = require('./rules/root-elements');
const singleComponentChild = require('./rules/single-component-child');
const singleDefaultComponent = require('./rules/single-default-component');
const importsRelationTypes = require('./rules/imports-relation-types');

function checkAst(ast) {
  const rules = [
    rootElements,
    singleDefaultComponent,
    noComponentNesting,
    noImportInComponents,
    componentImportsNesting,
    singleComponentChild,
    importsRelationTypes
  ];

  return rules
    .map(rule => rule(ast))
    .reduce((acc, res) => acc.concat(res), result.empty())
    .build();
}

module.exports = checkAst;
