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

## Demo: First name, last name component

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
{
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
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
}
```

## Usage

### Imports

#### Default import

Import a default component.

**Usage**
```html
<import path as />
```

**Attributes**
  * `path`: Path to the file to import,
  * `as`: Tag name to use to reference the default component of the imported
    file.

**Example**
```html
<import path="path/to/component" as="my-component" />
```

_Is equivalent in ES2015 to_
```js
import MyComponent from 'path/to/component';
```

#### Named imports

Import a component by its name. The import tag for a named import must be child
of an other import tag having a `path` attribute.

**Usage**
```html
<import path>
  <import name as />
</import>
```

**Attributes**
  * `path`: Path to the file to import,
  * `name`: Name of the component to import,
  * `as`: Tag name to use to reference the component.

**Example**
```html
<import path="path/to/component">
  <import name="ANamedImport" as="a-named-import" />
  <import name="AnohterNamedImport" as="second-component" />
</import>
```

_Is equivalent in ES2015 to_
```js
import {
  ANamedImport as ANamedImport,
  AnohterNamedImport as SecondComponent
} from 'path/to/component';
```

#### Default and named imports

Import the default and some named components from the same file.

**Usage**
```html
<import path as>
  <import name as />
</import>
```

**Attributes**
  * _See default imports and Named imports._

**Example**
```html
<import path="path/to/component" as="my-component">
  <import name="ANamedImport" as="a-named-import" />
  <import name="AnohterNamedImport" as="second-component" />
</import>
```

_Is equivalent in ES2015 to_
```js
import MyComponent, {
  ANamedImport as ANamedImport,
  AnohterNamedImport as SecondComponent
} from 'path/to/component';
```

### Templates

A template is an HTML node containing a single root child.

#### Default template

Each file must contain only one default template. A default template cannot be
named, it is the entry point of the file.

**Usage**
```html
<template>
  <!-- Content -->
</template>
```

**Attributes**
  * None.

**Example**
```html
<template>
  <div>Hello World</div>
</template>
```

_Is equivalent in React to_
```js
export default function() {
  return (
    <div>Hello World</div>
  );
}
```

#### Named templates

A named template is simply a template with a `name` attribute, which means it
can be used by referencing its name. All named templates will be exported under
their given name.

**Usage**
```html
<template name>
  <!-- Content -->
</template>
```

**Attributes**
  * `name`: Tag name to use to reference this template.

**Example**
```html
<template name="named-template">
  <!-- ...  -->
</template>

<template>
  <!-- ...  -->
  <named-template />
  <!-- ...  -->
</template>
```

_Is equivalent in React to_
```js
export function NamedTemplate(props) {
  return (
    // ...
  );
}

export default function(props) {
  return (
    // ...

    <NamedTemplate />

    // ...
  );
}
```

### Loops

A loop is simply the application of a template for the values contained in an
array. Each value in the array must have a unique identifier.

**Usage**
```html
<repeat template for-each key />
```

**Attributes**
  * `template`: Tag name of the template to use,
  * `for-each`: Array of data,
  * `key`: Name of the attribute to use as identifier.

**Example**
```html
<template name="user-component">
  <div>{{ props.name }}</div>
</template>

<template>
  <div class="users">
    <repeat
      template="user-component"
      for-each="{{ props.users }}"
      key="userId"
    />
  </div>
</template>
```

_Is equivalent in React to_
```js
export function UserComponent(props) {
  return (
    <div>{{ props.name }}</div>
  );
}

export default function(props) {
  const users = props.users.map(user => (
    <UserComponent
      { ...user }
      key={ user.userId }
    />
  ));

  return (
    <div className="users">
      { users }
    </div>
  );
}
```
