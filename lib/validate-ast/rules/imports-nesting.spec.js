/* eslint no-unused-expressions: "off" */
'use strict';

const chai = require('chai');
const expect = chai.expect;

const importsNesting = require('./imports-nesting');
const result = require('../result');

describe('validate-ast', function() {
  describe('import-nesting', function() {
    it(`should accept a unique '<link>' element`, function() {
      const ast = [{ name: 'link', children: [] }];
      const res = importsNesting(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });

    it(`should reject non inner '<link>' elements`, function() {
      const ast = [{
        name: 'link',
        children: [
          { name: 'div', children: [], meta: {} },
          { name: 'div', children: [], meta: {} }
        ],
        meta: {}
      }];
      const res = importsNesting(ast).build();

      expect(res.errors.length).to.equal(2);
    });

    it(`should accept inner '<link>' elements`, function() {
      const ast = [{
        name: 'link',
        children: [
          { name: 'link', children: [] },
          { name: 'link', children: [] }
        ]
      }];
      const res = importsNesting(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });

    it(`should reject children of inner '<link>' elements`, function() {
      const ast = [{
        name: 'link',
        children: [{ name: 'link', children: [{ name: 'whatever' }], meta: {} }],
        meta: {}
      }];
      const res = importsNesting(ast).build();

      expect(res.errors.length).to.equal(1);
    });
  });
});
