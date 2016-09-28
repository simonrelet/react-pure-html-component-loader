'use strict';

const HTML_TO_JSX_ATTR = {
  'class': 'className',
  'on-change': 'onChange',
  'for': 'htmlFor',
  'autofocus': 'autoFocus',
  'on-mouse-down': 'onMouseDown'
};

function toJsx(html) {
  return HTML_TO_JSX_ATTR[html] || html;
}

module.exports = {
  toJsx
};
