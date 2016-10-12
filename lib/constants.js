'use strict';

module.exports = {
  tags: {
    IMPORT: 'link',
    TEMPLATE: 'template',
    CONTROLS: 'render'
  },

  attributes: {
    import: {
      PATH: 'href',
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
