/* eslint no-unused-expressions: "off" */
'use strict';

const chai = require('chai');
const expect = chai.expect;

const importsNesting = require('./template-imports-nesting');
const result = require('../result');

describe('validate-ast', function() {
  describe('import-nesting', function() {
    it(`should accept a unique '<link rel="import">' element`, function() {
      const ast = [{ name: 'link', attrs: { rel: 'import' }, children: [] }];
      const res = importsNesting(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });

    it(`should reject non inner '<link rel="import">' elements`, function() {
      const ast = [{
        name: 'link',
        attrs: { rel: 'import' },
        children: [
          { name: 'div', children: [], meta: {} },
          { name: 'div', children: [], meta: {} }
        ],
        meta: {}
      }];
      const res = importsNesting(ast).build();

      expect(res.errors.length).to.equal(2);
    });

    it(`should accept inner '<link rel="import">' elements`, function() {
      const ast = [{
        name: 'link',
        attrs: { rel: 'import' },
        children: [
          { name: 'link', attrs: { rel: 'import' }, children: [] },
          { name: 'link', attrs: { rel: 'import' }, children: [] }
        ]
      }];
      const res = importsNesting(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });

    it(`should reject children of inner '<link rel="import">' elements`, function() {
      const ast = [{
        name: 'link',
        attrs: { rel: 'import' },
        children: [{
          name: 'link',
          attrs: { rel: 'import' },
          children: [{ name: 'whatever' }],
          meta: {}
        }],
        meta: {}
      }];
      const res = importsNesting(ast).build();

      expect(res.errors.length).to.equal(1);
    });
  });
});
