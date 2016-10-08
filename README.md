# react-html-template-loader

> A Webpack loader allowing imports of HTML templates as if they were React
> components.

## Usage

_./click-me-component.jsx.html_
```html
<template>
  <button use-props="{{ props.buttonProps }}">
    Clicked {{ props.clicks }} time(s)
  </button>
</template>
```

_./click-me-container.jsx_
```js
import React, { Component } from 'react';

// Import the HTML template as if it was a React component.
import ClickMeComponent from './click-me-component';

export default class ClickMeContainer extends Component {
  constructor(props) {
    super(props);

    this.state = { clicks: 0 };
    this.buttonProps = { onMouseDown: this.handleMouseDown.bind(this) };
  }

  handleMouseDown(e) {
    e.preventDefault();
    this.setState({ clicks: this.state.clicks++ });
  }

  render() {
    return (
      <ClickMeComponent
        clicks={ this.state.clicks }
        buttonProps={ this.buttonProps }
      />
    );
  }
}
```

Add to your _webpack.config.js_ the react-html-template-loader:
```js
{
  module: {
    loaders: [
      {
        test: /\.jsx\.html$/,
        exclude: /node_modules/,
        loader: 'babel!react-html-template'
      }
    ]
  },
  resolve: {
    extensions: [ '.jsx', '.jsx.html' ]
  }
}
```

## Features

  * Default and named imports/exports,
  * Multiple template definitions in the same file,
  * Explicit conditional and loop rendering,
  * Props spreading,
  * CSS modules.

## Installation

```
npm install --save-dev react-html-template-loader
```

## API

### Imports

#### Default import

Import the default export of a file.

**Usage**
```html
<import path as />
```

**Attributes**
  * `path`: Path to the file to import,
  * `as`: Name to use to reference the default export of the file.

**Example**
```html
<import path="path/to/component" as="my-component" />
```

_Is equivalent in ES2015 to:_
```js
import MyComponent from 'path/to/component';
```

#### Named imports

Import an export by its name. The `<import>` tag for a named import must be
child of an other `<import>` tag having a `path` attribute.

**Usage**
```html
<import path>
  <import name as />
</import>
```

**Attributes**
  * `path`: Path to the file to import,
  * `name`: Name of the variable to import,
  * `as`: Name to use to reference the export.

**Example**
```html
<import path="path/to/component">
  <import name="ANamedImport" as="a-named-import" />
  <import name="AnohterNamedImport" as="my-component" />
</import>
```

_Is equivalent in ES2015 to:_
```js
import {
  ANamedImport as ANamedImport,
  AnohterNamedImport as MyComponent
} from 'path/to/component';
```

#### Default and named imports

Import the default and some named exports from the same file.

**Usage**
```html
<import path as>
  <import name as />
</import>
```

**Attributes**
  * _See [default imports](#default-import) and [named imports](#named-imports)._

**Example**
```html
<import path="path/to/component" as="my-component">
  <import name="ANamedImport" as="a-named-import" />
  <import name="AnohterNamedImport" as="my-component" />
</import>
```

_Is equivalent in ES2015 to:_
```js
import MyComponent, {
  ANamedImport as ANamedImport,
  AnohterNamedImport as MyComponent
} from 'path/to/component';
```

### Templates

A template is an HTML tag containing a single root child.

#### Default template

Each file must contain at most one default template. A default template cannot
be named, it is the main template of the file.

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

_Is equivalent in React to:_
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

_Is equivalent in React to:_
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

A loop will render its content for each element in the array. The `render` tag
can only have one child. When looping over an array, an `id` tag must be set on
each child tag.

**Usage**
```html
<render for-each as>
  <!-- Content -->
</render>
```

**Attributes**
  * `for-each`: Array of data,
  * `as`: Name of the variable to use for each element.

**Example**
```html
<template>
  <div class="users">
    <render for-each="{{ props.users }}" as="user">
      <div key="{{ user.id }}">{{ user.name }}</div>
    </render>
  </div>
</template>
```

_Is equivalent in React to:_
```js
export default function(props) {
  return (
    <div className="users">
      { props.users.map(user => (
        <div key={ user.id }>
          {{ user.name }}
        </div>
      )) }
    </div>
  );
}
```

### Conditionals

A conditional will render its content depending on a condition. The `render` tag
can only have one child.

**Usage**
```html
<render if>
  <!-- Content -->
</render>
```

**Attributes**
  * `if`: Condition to fulfill for the content to be rendered.

**Example**
```html
<template>
  <div class="user">
    <render if="{{ props.user }}">
      <div>{{ props.user.name }}</div>
    </render>
  </div>
</template>
```

_Is equivalent in React to:_
```js
export default function(props) {
  return (
    <div className="user">
      { props.user && <div>{{ props.user.name }}</div> }
    </div>
  );
}
```

### Props spreading

Props spreading is used to simplify the template so the focus can be kept on the
UI.

**Usage**
```html
<any-tag use-props>
  <!-- Content -->
</any-tag>
```

**Attributes**
  * `use-props`: Variable that will be spread in the corresponding tag.

**Example**

_Instead of writing:_
```html
<template>
  <button
    on-mouse-down="{{ props.handleMouseDown }}"
    on-key-down="{{ props.handleKeyDown }}"
    on-focus="{{ props.handleFocus }}"
    on-blur="{{ props.handleBlur }}"
  >
    Clicked {{ props.clicks }} time(s)
  </button>
</template>
```

_Just write:_
```html
<template>
  <button use-props="{{ props.buttonProps }}">
    Clicked {{ props.clicks }} time(s)
  </button>
</template>
```

_Which is equivalent in React to:_
```js
export default function(props) {
  return (
    <button { ...props.buttonProps }>
      Clicked {{ props.clicks }} time(s)
    </button>
  );
}
```

## Background

Basically, React is awesome for developers but isn't as simple as HTML for most
designers, but HTML isn't as flexible as a programing language. Thanks to the
pure functional components and the Container and Components pattern, most
components are templates having data as input and some UI as output. What if
those pure functional templates could simply be in written in HTML to be easily
created and modified by designers?

**react-html-template-loader** allows to use both the simplicity of the HTML
syntax and the efficiency of React components. It is a Webpack loader compiling
HTML templates into pure functional React components.

# License

MIT.
