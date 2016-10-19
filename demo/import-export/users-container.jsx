'use strict';

import React, { Component } from 'react';
import axios from 'axios';

import UsersView from './users-view';

export default class UsersContainer extends Component {
  constructor(props) {
    super(props);

    this.state = { users: [] };
  }

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers() {
    axios('https://randomuser.me/api?results=10&seed=react')
      .then(res => this.setState({ users: res.data.results }));
  }

  render() {
    return (
      <UsersView users={ this.state.users } />
    );
  }
}

UsersContainer.displayName = 'UsersContainer';
