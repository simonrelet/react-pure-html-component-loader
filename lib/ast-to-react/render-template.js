'use strict';

const astTypes = require('../html-to-ast').types;
const attributeConversion = require('../attribute-conversion');
const constants = require('../constants');

const INDENT = '  ';
const bindings = constants.attributes.bindings;
const controlsAttrs = constants.attributes.controls;

function renderJsxText(node, indent) {
  let value = node.value;
  if (bindings.PATTERN.test(value)) {
    value = value.replace(bindings.PATTERN, (m, g1) => `{ ${g1.trim()} }`);
  }
  return `${indent}${value}\n`;
}

function renderJsxPropsSpreading(value) {
  return value.replace(
    bindings.STRICT_PATTERN,
    (m, g1) => `{ ...${g1.trim()} }`
  );
}

function renderJsxProp(value, attr) {
  // Consider the absence or an empty attribute (i.e. `attr` or `attr=""`) as
  // `true`.
  const nodeValue = value || 'true';

  if (bindings.BOLLEAN_PATTERN.test(nodeValue)) {
    value = nodeValue.replace(
      bindings.BOLLEAN_PATTERN,
      (m, g1) => `{ ${g1.toLowerCase()} }`
    );

  // It only contains a binding (i.e. `attr="{{ expression }}")`, in this case
  // it should be converted to `attr={ expression }`.
  } else if (bindings.STRICT_PATTERN.test(nodeValue)) {
    value = nodeValue.replace(
      bindings.STRICT_PATTERN,
      (m, g1) => `{ ${g1.trim()} }`
    );

  // It is a string template (i.e. `attr="hello {{ expression }}"`), in this
  // case it should be converted to `attr={ `hello ${ expression }` }`.
  } else if (bindings.PATTERN.test(nodeValue)) {
    const replacement = nodeValue.replace(
      bindings.PATTERN,
      (m, g1) => `\${ ${g1.trim()} }`
    );
    value = `{ \`${replacement}\` }`;

  // There are no bindings, it is just a string.
  } else {
    value = `'${nodeValue}'`;
  }

  return `${attr}=${value}`;
}

function renderJsxProps(node) {
  const mapper = k => {
    const attr = attributeConversion.toJsx(k);
    const value = node.attrs[k];

    switch (attr) {
      case constants.attributes.PROPS_SPREADING:
        return renderJsxPropsSpreading(value);
      default:
        return renderJsxProp(value, attr);
    }
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
  const test = node.attrs[controlsAttrs.CONDITIONALS_TEST].replace(
    bindings.STRICT_PATTERN,
    (m, g1) => g1.trim()
  );
  const condition = `${indent}{ (${test}) && (\n`;
  const children = renderJsxNode(node.children[0], tagToVar, `${INDENT}${indent}`);
  const closing = `${indent}) }\n`;

  return `${condition}${children}${closing}`;
}

function renderJsxLoopTag(node, tagToVar, indent) {
  const arrayName = node.attrs[controlsAttrs.LOOP_ARRAY].replace(
    bindings.STRICT_PATTERN,
    (m, g1) => g1.trim()
  );
  const varName = node.attrs[controlsAttrs.LOOP_VAR_NAME].replace(
    bindings.STRICT_PATTERN,
    (m, g1) => g1.trim()
  );
  const loop = `${indent}{ ${arrayName}.map(${varName} => (\n`;
  const children = renderJsxNode(node.children[0], tagToVar, `${INDENT}${indent}`);
  const closing = `${indent})) }\n`;

  return `${loop}${children}${closing}`;
}

function renderJsxControlsTag(node, tagToVar, indent) {
  if (node.attrs[controlsAttrs.CONDITIONALS_TEST]) {
    return renderJsxConditionalTag(node, tagToVar, indent);
  }
  return renderJsxLoopTag(node, tagToVar, indent);
}

function renderJsxTag(node, tagToVar, indent) {
  switch (node.name) {
    case constants.tags.CONTROLS:
      return renderJsxControlsTag(node, tagToVar, indent);
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

module.exports = renderTemplate;
module.exports.renderJsxText = renderJsxText;
module.exports.renderJsxPropsSpreading = renderJsxPropsSpreading;
module.exports.renderJsxProp = renderJsxProp;
module.exports.renderJsxProps = renderJsxProps;
module.exports.renderJsxBasicTag = renderJsxBasicTag;
module.exports.renderJsxConditionalTag = renderJsxConditionalTag;
module.exports.renderJsxLoopTag = renderJsxLoopTag;
