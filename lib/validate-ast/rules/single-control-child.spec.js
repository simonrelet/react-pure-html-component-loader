'use strict';

const chai = require('chai');
const expect = chai.expect;

const singleControlChild = require('./single-control-child');
const result = require('../result');

module.exports = function() {
  describe('single-control-child', function() {
    it(`should reject absence of child`, function() {
      const ast = [{
        name: 'render',
        meta: {},
        children: []
      }];
      const res = singleControlChild(ast).build();

      expect(res.errors.length).to.equal(1);
    });

    it(`should reject multiple of children`, function() {
      const ast = [{
        name: 'render',
        meta: {},
        children: [
          { name: 'div', children: [] },
          { name: 'div', children: [] }
        ]
      }];
      const res = singleControlChild(ast).build();

      expect(res.errors.length).to.equal(1);
    });

    it(`should accept single child`, function() {
      const ast = [{
        name: 'render',
        children: [{ name: 'div', children: [] }]
      }];
      const res = singleControlChild(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });
  });
};
