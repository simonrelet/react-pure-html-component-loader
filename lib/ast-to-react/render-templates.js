'use strict';

const astTypes = require('../html-to-ast').types;
const attributeConversion = require('../attribute-conversion');
const constants = require('../constants');

const INDENT = '  ';
const bindings = constants.attributes.bindings;
const loopsAttrs = constants.attributes.loops;
const conditionalsAttrs = constants.attributes.conditionals;

function renderJsxText(node, indent) {
  let value = node.value;
  if (bindings.PATTERN.test(value)) {
    value = value.replace(bindings.PATTERN, '{ $1 }');
  }
  return `${indent}${value}\n`;
}

function renderJsxProps(node) {
  const mapper = k => {
    const attr = attributeConversion.toJsx(k);

    // Consider the absence or an empty attribute (i.e. `attr` or `attr=""`) as
    // `true`.
    const nodeValue = node.attrs[k] || 'true';
    let value;

    if (bindings.BOLLEAN_PATTERN.test(nodeValue)) {
      value = nodeValue.replace(
        bindings.BOLLEAN_PATTERN,
        (m, g1) => `{ ${g1.toLowerCase()} }`
      );

    // It only contains a binding (i.e. `attr="{{ expression }}")`, in this case
    // it should be converted to `attr={ expression }`.
    } else if (bindings.STRICT_PATTERN.test(nodeValue)) {
      value = nodeValue.replace(bindings.STRICT_PATTERN, '{ $1 }');

    // It is a string template (i.e. `attr="hello {{ expression }}"`), in this
    // case it should be converted to `attr={ `hello ${ expression }` }`.
    } else if (bindings.PATTERN.test(nodeValue)) {
      const replacement = nodeValue.replace(bindings.PATTERN, '$${ $1 }');
      value = `{ \`${replacement}\` }`;

    // There are no bindings, it is just a string.
    } else {
      value = `'${nodeValue}'`;
    }

    return `${attr}=${value}`;
  };

  const attrs = Object.keys(node.attrs)
    .map(mapper)
    .reduce((a, b) => `${a} ${b}`, '');

  return attrs;
}

function renderJsxBasicTag(node, tagToVar, indent) {
  const name = tagToVar[node.name] || node.name;
  const openTag = `${indent}<${name}`;
  const props = renderJsxProps(node);

  if (node.children.length > 0) {
    const closingTag = `${indent}</${name}>`;
    const children = node.children
      .map(child => renderJsxNode(child, tagToVar, `${INDENT}${indent}`))
      .join('');

    return `${openTag}${props}>\n${children}${closingTag}\n`;
  }

  return `${openTag}${props} />\n`;
}

function renderJsxConditionalTag(node, tagToVar, indent) {
  const test = node.attrs[conditionalsAttrs.TEST]
    .replace(bindings.STRICT_PATTERN, '$1')
    .trim();
  const condition = `${indent}{ (${test}) && (\n`;
  const children = renderJsxNode(node.children[0], tagToVar, `${INDENT}${indent}`);
  const closing = `${indent}) }\n`;

  return `${condition}${children}${closing}`;
}

function renderJsxLoopTag(node, tagToVar, indent) {
  const arrayName = node.attrs[loopsAttrs.ARRAY]
    .replace(bindings.STRICT_PATTERN, '$1')
    .trim();
  const varName = node.attrs[loopsAttrs.VAR_NAME]
    .replace(bindings.STRICT_PATTERN, '$1')
    .trim();
  const loop = `${indent}{ ${arrayName}.map(${varName} => (\n`;
  const children = renderJsxNode(node.children[0], tagToVar, `${INDENT}${indent}`);
  const closing = `${indent})) }\n`;

  return `${loop}${children}${closing}`;
}

function renderJsxTag(node, tagToVar, indent) {
  switch (node.name) {
    case constants.tags.LOOPS:
      return renderJsxLoopTag(node, tagToVar, indent);
    case constants.tags.CONDITIONALS:
      return renderJsxConditionalTag(node, tagToVar, indent);
    default:
      return renderJsxBasicTag(node, tagToVar, indent);
  }
}

function renderJsxNode(node, tagToVar, indent) {
  switch (node.type) {
    case astTypes.TEXT:
      return renderJsxText(node, indent);
    default:
      return renderJsxTag(node, tagToVar, indent);
  }
}

function extractJsx(node, tagToVar) {
  const jsx = renderJsxNode(node, tagToVar, `${INDENT}${INDENT}`);
  return `${INDENT}return (\n${jsx}${INDENT});\n`;
}

function renderTemplate(node, tagToVar) {
  // Remove the `<template>` tag.
  const template = node.children[0];
  return extractJsx(template, tagToVar);
}

function renderDefaultTemplate(node, tagToVar) {
  const content = renderTemplate(node, tagToVar);
  return `export default function(props) {\n${content}}\n`;
}

function renderNamedTemplate(node, tagToVar) {
  const varName = tagToVar[node.attrs.name];
  const content = renderTemplate(node, tagToVar);
  return `export function ${varName}(props) {\n${content}}\n`;
}

function renderTemplates(options) {
  const renderedDefault = renderDefaultTemplate(
    options.defaultNode,
    options.tagToVar
  );

  const renderedNamed = options.namedNodes
    .map(node => renderNamedTemplate(node, options.tagToVar));

  return renderedNamed.concat([ renderedDefault ]);
}

module.exports = renderTemplates;