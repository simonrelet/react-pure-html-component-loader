'use strict';

const HTML_TO_JSX_ATTR = {
  'class': 'className',
  'on-change': 'onChange',
  'for': 'htmlFor'
};

function toJsx(html) {
  return HTML_TO_JSX_ATTR[html] || html;
}

module.exports = {
  toJsx
};
