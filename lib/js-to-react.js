'use strict';

const pascalCase = require('change-case').pascalCase;

const astTypes = require('./html-to-js').types;
const constants = require('./constants');
const attributeConversion = require('./attribute-conversion');

const bindings = constants.attributes.bindings;

const INDENT = '  ';
const HEADER = `'use strict';\n\nimport React from 'react';`;
const EXPORT = `export default function(props) {\n${INDENT}return (\n`;
const FOOTER = `${INDENT});\n}`;

/**
 * An AST.
 *
 * @typedef {object} AST
 *
 * @property {Node[]} roots  The root nodes
 */

/**
 * An AST node.
 *
 * @typedef {object} Node
 *
 * @property {string} type The type of the node
 */

/**
 * An AST tag node.
 *
 * @typedef {object} TagNode
 *
 * @property {string} type      The type of the node
 * @property {string} name      The tag name
 * @property {object} attrs     The attributes
 * @property {Node[]} children  The children
 */

/**
 * An AST text node.
 *
 * @typedef {object} TextNode
 *
 * @property {string} type   The type of the node
 * @property {string} value  The text value
 */

/**
 * An AST default import tag node.
 *
 * @typedef {object} DefaultImportNode
 *
 * @property {string}            attrs.path  The import path
 * @property {string}            attrs.as    The tag name used for the import
 * @property {NamedImportNode[]} children    The related named imports
 */

/**
 * An AST named import tag node.
 *
 * @typedef {object} NamedImportNode
 *
 * @property {string} attrs.name  The original variable name of the import
 * @property {string} attrs.as    The tag name used for the import
 */

/**
 * An import.
 *
 * @typedef {object} Import
 *
 * @property {string}   path             The import path
 * @property {object}   default          The default import
 * @property {string}   default.tagName  The tag name used
 * @property {string}   default.varName  The variable name to use
 * @property {object[]} named            The array of named import
 * @property {string}   named[].tagName  The tag name used
 * @property {string}   named[].varName  The variable name to use
 * @property {string}   named[].from     The original variable name
 */

/**
 * A JsHtml.
 *
 * @typedef {object} JsHtml
 *
 * @property {DefaultImportNode[]} imports  The array of imports
 * @property {TagNode}             root     The root node
 */

/**
 * Returns a string of the JSX props corresponding to the attributes of the
 * given node. If the node doesn't have attributes an empty string is returned,
 * otherwise the returned string will always start with a single space.
 *
 * @param  {TagNode} node  The node
 * @return {string}        The JSX props as a string
 */
function getJsxProps(node) {
  const mapper = k => {
    const attr = attributeConversion.toJsx(k);
    const nodeValue = node.attrs[k];
    let value = '';

    // It only contains a binding (i.e. `attr="{{ expression }}")`, in this case
    // it should be converted to `attr={ expression }`.
    if (bindings.STRICT_PATTERN.test(nodeValue)) {
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

/**
 * Returns a string corresponding to the text content node. If the text contains
 * bindings, there are replaced.
 *
 * @param  {TextNode} node    The text node
 * @param  {string}   indent  The current indentation
 * @return {string}           The JSX text content
 */
function getJsxText(node, indent) {
  let value = node.value;
  if (bindings.PATTERN.test(value)) {
    value = value.replace(bindings.PATTERN, '{ $1 }');
  }
  return `${indent}${value}`;
}

/**
 * Maps a tag name (HTML) to its corresponding variable name (JS). If there is
 * no mapping for the given tag name, the tag name is returned.
 *
 * @param  {string} name     The tag name
 * @param  {object} imports  The imports map
 * @return {string}          The mapped name
 */
function getTagName(name, imports) {
  return imports[name] || name;
}

/**
 * Returns a string corresponding to the tag node. This function renders the
 * attributes and the children.
 *
 * @param  {TagNode}  node     The tag node
 * @param  {object}   imports  The imports map
 * @param  {string}   indent   The current indentation
 * @return {string}            The JSX tag
 */
function getJsxTag(node, imports, indent) {
  const name = getTagName(node.name, imports);
  const openTag = `<${name}`;
  const props = getJsxProps(node);

  if (node.children.length > 0) {
    const closingTag = `</${name}>`;
    const children = node.children
      .map(child => getJsxRec(child, imports, `  ${indent}`))
      .reduce((a, b) => `${a}${b}\n`, '\n');

    return `${indent}${openTag}${props}>${children}${indent}${closingTag}`;
  }

  return `${indent}${openTag}${props} />`;
}

/**
 * Returns a string corresponding to either a tag or a text node.
 *
 * @param  {Node}   node     The node
 * @param  {object} imports  The imports map
 * @param  {string} indent   The current indentation
 * @return {string}          The JSX node
 */
function getJsxRec(node, imports, indent) {
  switch (node.type) {
    case astTypes.TEXT:
      return getJsxText(node, indent);
    default:
      return getJsxTag(node, imports, indent);
  }
}

/**
 * Reduces the imports to a basic map.
 *
 * @param  {Import[]} imports  The array of imports
 * @return {object}            The imports map
 */
function getImportsMap(imports) {
  const reducer = (imports, i) => {
    if (i.default) {
      imports[i.default.tagName] = i.default.varName;
    }

    if (i.named) {
      i.named.forEach(n => {
        imports[n.tagName] = n.varName;
      });
    }

    return imports;
  };

  return imports.reduce(reducer, {});
}

/**
 * Wrapper function for the recursive one.
 *
 * @param  {TagNode}  root     The root node
 * @param  {Import[]} imports  The array of imports
 * @return {string}            The JSX content
 */
function getJsx(root, imports) {
  return getJsxRec(root, getImportsMap(imports), `${INDENT}${INDENT}`);
}

/**
 * Returns a string corresponding to the imports nodes.
 *
 * @param  {Import[]} imports  The array of imports
 * @return {string}            The JS imports
 */
function getImports(imports) {
  const mapper = i => {
    let varName = '';
    if (i.default) {
      varName = i.default.varName;
    }

    let namedImports = '';
    if (i.named) {
      const named = i.named.map(n => `${n.from} as ${n.varName}`);
      namedImports = `{ ${named.join(', ')} }`;
    }

    let sep = '';
    if (varName && namedImports) {
      sep = ', ';
    }

    return `import ${varName}${sep}${namedImports} from '${i.path}';`;
  };

  return imports.map(mapper).reduce((a, b) => `${a}\n${b}`, '');
}

/**
 * Returns an array of simplified imports.
 *
 * @param  {NamedImportNode[]} imports  The array of imports
 * @return {Import[]}                   The simplified version of the imports
 */
function cleanImports(imports) {
  return imports.map(i => {
    const res = { path: i.attrs.path };

    if (i.attrs.as) {
      res.default = {
        tagName: i.attrs.as,
        varName: pascalCase(i.attrs.as)
      };
    }

    if (i.children.length > 0) {
      res.named = i.children.map(child => ({
        tagName: child.attrs.as,
        varName: pascalCase(child.attrs.as),
        from: child.attrs.name
      }));
    }

    return res;
  });
}

/**
 * Extracts the import and root to a new object.
 *
 * @param  {AST}    ast  The HTML AST
 * @return {JsHtml}      The JsHtml
 */
function extractImports(ast) {
  const reducer = (component, root) => {
    if (root.type === astTypes.TAG) {
      if (root.name === constants.tags.IMPORT) {
        component.imports.push(root);
      } else if (root.name === constants.tags.TEMPLATE) {
        component.root = root.children[0];
      }
    }
    return component;
  };

  return ast.roots.reduce(reducer, { imports: [] });
}

/**
 * Converts a HTML AST to a React component as a string.
 *
 * @param  {AST}    ast  The HTML AST
 * @return {string}      The React component
 */
module.exports = function(ast) {
  const jsHtml = extractImports(ast);
  const imports = cleanImports(jsHtml.imports);
  const importsStr = getImports(imports);
  const jsxStr = getJsx(jsHtml.root, imports);

  return `${HEADER}${importsStr}\n\n${EXPORT}${jsxStr}\n${FOOTER}`;
};
