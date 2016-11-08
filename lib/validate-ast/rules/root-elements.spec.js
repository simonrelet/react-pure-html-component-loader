'use strict';

const chai = require('chai');
const expect = chai.expect;

const rootElements = require('./root-elements');
const result = require('../result');

describe('validate-ast', function() {
  describe('root-elements', function() {
    it(`should accept '<template>' as root element`, function() {
      const ast = [{ name: 'template' }];
      const res = rootElements(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });

    it(`should accept '<link>' as root element`, function() {
      const ast = [{ name: 'link' }];
      const res = rootElements(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });

    [ 'div', 'span', 'html', 'body', 'header', 'title', 'wat' ].forEach(elt => {
      it(`should reject '<${elt}>' as root element`, function() {
        const ast = [{ name: elt, meta: {} }];
        const res = rootElements(ast).build();

        expect(res.errors.length).to.equal(1);
      });
    });
  });
});
