'use strict';

module.exports = Object.freeze({
  tags: {
    IMPORT: 'link',
    COMPONENT: 'template',
    CONTROLS: 'render'
  },

  attributes: {
    import: {
      TYPE: 'rel',
      PATH: 'href',
      NAMED: 'name',
      ALIAS: 'id',
      OBJECT_VALUE: 'id',

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

    components: {
      ID: 'id',
      DEFAULT: 'default'
    },

    PROPS_SPREADING: 'use-props',

    bindings: {
      PATTERN: /{{\s*((?:(?!(?:{{|}})).)*?)\s*}}/g,
      STRICT_PATTERN: /^\s*{{\s*((?:(?!(?:{{|}})).)*?)\s*}}\s*$/,
      BOLLEAN_PATTERN: /^\s*(true|false)\s*$/i
    }
  }
});
