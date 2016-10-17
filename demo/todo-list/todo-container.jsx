'use strict';

import React, { Component } from 'react';

import TodoView from './todo-view';

export default class Todo extends Component {
  constructor(props) {
    super(props);

    this.state = { todos: [], value: '' };
    this.inputProps = { onChange: this.handleValueChanged.bind(this) };
    this.formProps = { onSubmit: this.handleAddTodo.bind(this) };
  }

  handleValueChanged(e) {
    e.preventDefault();
    this.setState({ value: e.target.value });
  }

  handleAddTodo(e) {
    e.preventDefault();

    const { todos, value } = this.state;
    this.setState({ todos: todos.concat(value), value: '' });
  }

  render() {
    const { todos, value } = this.state;
    return (
      <TodoView
        formProps={ this.formProps }
        inputProps={{ ...this.inputProps, value }}
        todos={ todos }
      />
    );
  }
}

Todo.displayName = 'Todo';
