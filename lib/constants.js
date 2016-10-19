'use strict';

module.exports = {
  tags: {
    IMPORT: 'link',
    TEMPLATE: 'template',
    CONTROLS: 'render'
  },

  attributes: {
    import: {
      TYPE: 'rel',
      PATH: 'href',
      NAMED: 'name',
      ALIAS: 'id',
      OBJECT_VALUE: 'value',

      types: {
        COMPONENT: 'import',
        STYLESHEET: 'stylesheet'
      }
    },

    controls: {
      LOOP_ARRAY: 'for-each',
      LOOP_VAR_NAME: 'as',
      CONDITIONALS_TEST: 'if'
    },

    templates: {
      ID: 'id',
      DEFAULT: 'default'
    },

    PROPS_SPREADING: 'use-props',

    bindings: {
      PATTERN: /{{\s*((?:(?!(?:{{|}})).)*)\s*}}/g,
      STRICT_PATTERN: /^\s*{{\s*((?:(?!(?:{{|}})).)*)\s*}}\s*$/,
      BOLLEAN_PATTERN: /^\s*(true|false)\s*$/i
    }
  }
};
