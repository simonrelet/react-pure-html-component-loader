# html-to-react-loader

> A Webpack loader allowing imports of HTML files as there were React Components

## Installation

As a command line tool:

```
npm install -g html-to-react-loader
```

Or as a Webpack loader:

```
npm install --save-dev html-to-react-loader
```

## Usage

### Basic usage

_user-component.jsx.html_

```html
<import path="./text-input" as="text-input" />

<template>
  <div>
    <div class="row">
      <span class="label" for="first-name">First name:</span>
      <span class="value">
        <text-input
          id="first-name"
          value="{{ props.firstName }}"
          on-change="{{ props.onFirstNameChange }}"
        />
      </span>
    </div>

    <div class="row">
      <span class="label" for="last-name">Last name:</span>
      <span class="value">
        <text-input
          id="last-name"
          value="{{ props.lastName }}"
          on-change="{{ props.onLastNameChange }}"
        />
      </span>
    </div>

    <div class="row">
      <span class="label">Full name:</span>
      <span class="value">{{ props.firstName }} {{ props.lastName }}</span>
    </div>
  </div>
</template>
```

_user-container.jsx_

```js
'use strict';

import React, { Component } from 'react';
import UserComponent from './user-component';

export default class UserContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: ''
    };

    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
  }

  handleFirstNameChange(e) {
    e.preventDefault();
    this.setState({ firstName: e.target.value });
  }

  handleLastNameChange(e) {
    e.preventDefault();
    this.setState({ lastName: e.target.value });
  }

  render() {
    return (
      <UserComponent
        firstName={ this.state.firstName }
        lastName={ this.state.lastName }
        onFirstNameChange={ this.handleFirstNameChange }
        onLastNameChange={ this.handleLastNameChange }
      />
    );
  }
}

UserContainer.displayName = 'UserContainer';
```

Basic _webpack.config.js_

```js
module: {
  loaders: [
    {
      test: /\.jsx\.html$/,
      exclude: /node_modules/,
      loader: 'babel-loader!html-to-react'
    }
  ]
},

resolve: {
  extensions: [ '.jsx', '.jsx.html' ]
}
```

### Imports

**Default import**

```html
<import path="path/to/component" as="my-component" />
```

Is equivalent to:

```js
import MyComponent from 'path/to/component';
```

**Named imports**

```html
<import path="path/to/component">
  <import name="ANamedImport" as="a-named-import" />
  <import name="AnohterNamedImport" as="second-component" />
</import>
```

Is equivalent to:

```js
import {
  ANamedImport as ANamedImport,
  AnohterNamedImport as SecondComponent
} from 'path/to/component';
```

**Default and named imports**

```html
<import path="path/to/component" as="my-component">
  <import name="ANamedImport" as="a-named-import" />
  <import name="AnohterNamedImport" as="second-component" />
</import>
```

Is equivalent to:

```js
import MyComponent, {
  ANamedImport as ANamedImport,
  AnohterNamedImport as SecondComponent
} from 'path/to/component';
```
