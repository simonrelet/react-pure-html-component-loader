'use strict';

module.exports = {
  tags: {
    IMPORT: 'import',
    TEMPLATE: 'template',
    CONTROLS: 'render'
  },

  attributes: {
    import: {
      PATH: 'path',
      NAMED: 'name',
      ALIAS: 'as'
    },

    controls: {
      LOOP_ARRAY: 'for-each',
      LOOP_VAR_NAME: 'as',
      CONDITIONALS_TEST: 'if'
    },

    templates: {
      ID: 'id'
    },

    PROPS_SPREADING: 'use-props',

    bindings: {
      PATTERN: /{{\s+([^{}]*)\s+}}/g,
      STRICT_PATTERN: /^\s*{{\s*([^{}]*)\s*}}\s*$/,
      BOLLEAN_PATTERN: /^\s*(true|false)\s*$/i
    }
  }
};
