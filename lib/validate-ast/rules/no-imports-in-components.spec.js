'use strict';

const chai = require('chai');
const expect = chai.expect;

const noImportInComponents = require('./no-imports-in-components');
const result = require('../result');

module.exports = function() {
  describe('no-imports-in-components', function() {
    it(`should accept valid '<template>'`, function() {
      const ast = [{
        name: 'template',
        children: [{
          name: 'div',
          children: [{
            name: 'span',
            children: []
          }]
        }]
      }];
      const res = noImportInComponents(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });

    it(`should reject '<link>' in '<template>'`, function() {
      const ast = [{
        name: 'template',
        children: [{
          name: 'div',
          children: [{
            name: 'link',
            meta: {}
          }]
        }]
      }];
      const res = noImportInComponents(ast).build();

      expect(res.errors.length).to.equal(1);
    });
  });
};
