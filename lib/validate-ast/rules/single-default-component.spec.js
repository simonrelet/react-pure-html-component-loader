'use strict';

const chai = require('chai');
const expect = chai.expect;

const singleDefaultComponent = require('./single-default-component');
const result = require('../result');

module.exports = function() {
  describe('single-default-component', function() {
    it(`should accept absence of '<template default>'`, function() {
      const ast = [{
        name: 'template',
        attrs: {}
      }];
      const res = singleDefaultComponent(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });

    it(`should accept a single '<template default>'`, function() {
      const ast = [{
        name: 'template',
        attrs: { default: '' }
      }];
      const res = singleDefaultComponent(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });

    it(`should reject multiple '<template default>'`, function() {
      const ast = [
        {
          name: 'template',
          attrs: { default: '' },
          meta: {}
        },
        {
          name: 'template',
          attrs: { default: '' },
          meta: {}
        }
      ];
      const res = singleDefaultComponent(ast).build();

      expect(res.errors.length).to.equal(2);
    });
  });
};
