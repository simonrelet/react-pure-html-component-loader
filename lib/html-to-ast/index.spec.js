/* eslint no-unused-expressions: "off" */
'use strict';

const chai = require('chai');
const expect = chai.expect;

const htmlToAst = require('./');

describe('html-to-ast', function() {
  it('empty HTML should give empty roots', function() {
    const res = htmlToAst({ html: '' });
    expect(res).to.deep.equal({ roots: [] });
  });

  it('single HTML element should give single root', function() {
    const res = htmlToAst({ html: '<div/>' });
    expect(res.roots).to.have.lengthOf(1);
  });

  it('HTML element has corresponding type', function() {
    const res = htmlToAst({ html: '<div/>' });
    expect(res.roots[0].type).to.equal(htmlToAst.types.TAG);
  });

  it('HTML element with no attributes', function() {
    const res = htmlToAst({ html: '<div/>' });
    expect(res.roots[0].attrs).to.deep.equal({});
  });

  it('HTML element with no children', function() {
    const res = htmlToAst({ html: '<div/>' });
    expect(res.roots[0].children).to.have.lengthOf(0);
  });

  it('HTML element has corresponding name', function() {
    const res = htmlToAst({ html: '<div/>' });
    expect(res.roots[0].name).to.equal('div');
  });

  it('HTML element has corresponding children count', function() {
    const res = htmlToAst({ html: '<div><div/></div>' });
    expect(res.roots[0].children).to.have.lengthOf(1);
  });

  it('HTML element has corresponding child', function() {
    const res = htmlToAst({ html: '<div><div/></div>' });
    expect(res.roots[0].children[0].name).to.equal('div');
  });

  it('HTML text has corresponding type', function() {
    const res = htmlToAst({ html: '<i>Hello World</i>' });
    expect(res.roots[0].children[0].type).to.equal(htmlToAst.types.TEXT);
  });

  it('HTML element with attributes', function() {
    const res = htmlToAst({ html: '<div aaa="bbb" ccc/>' });
    expect(res.roots[0].attrs).to.deep.equal({ aaa: 'bbb', ccc: '' });
  });
});
