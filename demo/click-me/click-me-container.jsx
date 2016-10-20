'use strict';

import React, { Component } from 'react';

import ClickMeView from './click-me-view';

export default class ClickMeContainer extends Component {
  constructor(props) {
    super(props);

    this.state = { clicks: 0 };
    this.buttonProps = { onMouseDown: this.handleMouseDown.bind(this) };
  }

  handleMouseDown(e) {
    e.preventDefault();
    this.setState({ clicks: this.state.clicks + 1 });
  }

  render() {
    return (
      <ClickMeView
        buttonProps={ this.buttonProps }
        clicks={ this.state.clicks }
      />
    );
  }
}

ClickMeContainer.displayName = 'ClickMeContainer';
