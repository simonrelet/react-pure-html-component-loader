/* eslint no-unused-expressions: "off" */
'use strict';

const chai = require('chai');
const expect = chai.expect;

const convert = require('./attribute-conversion');

describe('attribute-conversion', function() {
  it('should convert `class` to `className`', function() {
    expect(convert.toJsx('class')).to.equal('className');
  });

  it('should convert `on-change` to `onChange`', function() {
    expect(convert.toJsx('on-change')).to.equal('onChange');
  });

  it('should convert `for` to `htmlFor`', function() {
    expect(convert.toJsx('for')).to.equal('htmlFor');
  });

  it('should convert `autofocus` to `autoFocus`', function() {
    expect(convert.toJsx('autofocus')).to.equal('autoFocus');
  });

  it('should convert `on-mouse-down` to `onMouseDown`', function() {
    expect(convert.toJsx('on-mouse-down')).to.equal('onMouseDown');
  });
});
