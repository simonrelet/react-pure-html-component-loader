'use strict';

const chai = require('chai');
const expect = chai.expect;

const noComponentNesting = require('./no-component-nesting');
const result = require('../result');

module.exports = function() {
  describe('no-component-nesting', function() {
    it(`should accept '<template>'s as root elements`, function() {
      const ast = [
        { name: 'template', children: [] },
        { name: 'template', children: [] },
        { name: 'template', children: [] }
      ];
      const res = noComponentNesting(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });

    it(`should reject nested '<template>'s`, function() {
      const ast = [{
        name: 'div',
        children: [{
          name: 'div',
          children: [{
            name: 'template',
            meta: {}
          }]
        }]
      }];
      const res = noComponentNesting(ast).build();

      expect(res.errors.length).to.equal(1);
    });
  });
};
