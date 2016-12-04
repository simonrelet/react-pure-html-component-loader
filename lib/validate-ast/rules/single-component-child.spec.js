'use strict';

const chai = require('chai');
const expect = chai.expect;

const singleComponentChild = require('./single-component-child');
const result = require('../result');

module.exports = function() {
  describe('single-component-child', function() {
    it(`should reject absence of child`, function() {
      const ast = [{
        name: 'template',
        attrs: {},
        meta: {},
        children: []
      }];
      const res = singleComponentChild(ast).build();

      expect(res.errors.length).to.equal(1);
    });

    it(`should reject multiple of children`, function() {
      const ast = [{
        name: 'template',
        attrs: {},
        meta: {},
        children: [{}, {}]
      }];
      const res = singleComponentChild(ast).build();

      expect(res.errors.length).to.equal(1);
    });

    it(`should accept single child`, function() {
      const ast = [{
        name: 'template',
        attrs: {},
        meta: {},
        children: [{}]
      }];
      const res = singleComponentChild(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });
  });
};
