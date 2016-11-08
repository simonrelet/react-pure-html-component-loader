'use strict';

const chai = require('chai');
const expect = chai.expect;

const noImportInTemplates = require('./no-imports-in-templates');
const result = require('../result');

describe('validate-ast', function() {
  describe('no-imports-in-templates', function() {
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
      const res = noImportInTemplates(ast).build();

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
      const res = noImportInTemplates(ast).build();

      expect(res.errors.length).to.equal(1);
    });
  });
});
