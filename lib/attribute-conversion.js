'use strict';

const HTML_TO_JSX_ATTR = {
  'class': 'className',
  'on-change': 'onChange',
  'for': 'htmlFor',
  'autofocus': 'autoFocus'
};

function toJsx(html) {
  return HTML_TO_JSX_ATTR[html] || html;
}

module.exports = {
  toJsx
};
