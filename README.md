# react-pure-html-component-loader

[![Build Status](https://travis-ci.org/simonrelet/react-pure-html-component-loader.svg?branch=master)](https://travis-ci.org/simonrelet/react-pure-html-component-loader) [![npm version](https://badge.fury.io/js/react-pure-html-component-loader.svg)](https://badge.fury.io/js/react-pure-html-component-loader)

> A Webpack loader allowing imports of HTML components as if they were React
> pure functional components.

## Usage

_./click-me-view.jsx.html_
```html
<template default>
  <button use-props="{{ props.buttonProps }}">
    Clicked {{ props.clicks }} time(s)
  </button>
</template>
```

_./click-me-container.jsx_
```js
import React, { Component } from 'react';

// Import the HTML template as if it was a React component.
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
```

Add the react-pure-html-component-loader to your _webpack.config.js_:
```js
{
  module: {
    loaders: [
      {
        test: /\.jsx\.html$/,
        exclude: /node_modules/,
        loader: 'babel!react-pure-html-component'
      }
    ]
  },
  resolve: {
    extensions: [ '.jsx', '.jsx.html' ]
  }
}
```

## Supported Features

  * Default and named imports/exports,
  * Multiple template definitions in the same file,
  * Explicit conditional and loop rendering,
  * Props spreading,
  * CSS modules.

## Installation

```
npm install --save-dev react-pure-html-component-loader
```

## Background

React provides a great developing experience, you finally have a strong
integration between the JavaScript code and the template syntax, it feels
natural to write.

But this merge isn't that good for designers who just know enough HTML and,
depending on the requirements, it can be a disqualifying criteria for React.

Thanks to the pure functional components and the [Presentational and Container
pattern](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.b4xio9vw9),
most components are simply _templates_ having data as input and some UI
as output. What if those pure functional components could simply be written in
HTML to be easily created and modified by designers?

The purpose of this Webpack loader is to convert **HTML components to React pure
functional component**.

**react-pure-html-component-loader** reconcile developers and designers. It is a
Webpack loader compiling HTML components into pure functional React components.

## Demo

Some demos can be found under the `demo/` folder, to launch one type in a
console:

```
npm run demo -- <demo-path>
```

_For example:_

```
npm run demo -- demo/todo-list
```

## API

### Imports

#### Component import

##### Default import

Import the default component of a file.

**Usage**
```html
<link rel="import" href id />
```

**Attributes**
  * `rel`: Must be set to `import` for this kind of relation,
  * `href`: Path of the file to import,
  * `id`: Name to use to reference the default component of the file.

**Example**
```html
<link rel="import" href="path/to/component" id="my-component" />
```

_Is equivalent in ES2015 to:_
```js
import MyComponent from 'path/to/component';
```

##### Named imports

Import an component by its name. The `<link>` tag for a named import must be
child of an other `<link>` tag having a `href` attribute.

**Usage**
```html
<link rel="import" href>
  <link rel="import" [name] id />
</link>
```

**Attributes**
  * `rel`: Must be set to `import` for this kind of relation,
  * `href`: Path of the file to import,
  * `name` _(Optional)_: Name of the component to import, can be omitted if it
    is the same as `id`,
  * `id`: Name to use to reference the component.

**Example**
```html
<link rel="import" href="path/to/component">
  <link rel="import" id="component-one" />
  <link rel="import" name="component-two" id="component-alias" />
</link>
```

_Is equivalent in ES2015 to:_
```js
import {
  ComponentOne,
  ComponentTwo as ComponentAlias
} from 'path/to/component';
```

##### Default and named imports

Import the default and some named components from the same file.

**Usage**
```html
<link rel="import" href id>
  <link rel="import" [name] id />
</link>
```

**Attributes**
  * _See [default imports](#default-import) and [named imports](#named-imports)._

**Example**
```html
<link rel="import" href="path/to/component" id="my-component">
  <link rel="import" id="component-one" />
  <link rel="import" name="component-two" id="component-alias" />
</link>
```

_Is equivalent in ES2015 to:_
```js
import MyComponent, {
  ComponentOne,
  ComponentTwo as ComponentAlias
} from 'path/to/component';
```

#### Stylesheet import (CSS Modules)

##### Global stylesheet

Import a global stylesheet.

**Usage**
```html
<link rel="stylesheet" href />
```

**Attributes**
  * `rel`: Must be set to `stylesheet` for this kind of relation,
  * `href`: Path of the file to import.

**Example**
```html
<link rel="stylesheet" href="./global-style" />
```

_Is equivalent in ES2015 to:_
```js
import './global-style';
```

##### Named stylesheet

Import a stylesheet and name it.

**Usage**
```html
<link rel="stylesheet" href id />
```

**Attributes**
  * `rel`: Must be set to `stylesheet` for this kind of relation,
  * `href`: Path of the file to import,
  * `id`: Value to use to reference the stylesheet.

**Example**
```html
<link rel="stylesheet" href="./style" id="{{ style }}" />
```

_Is equivalent in ES2015 to:_
```js
import style from './style';
```

_It can be used this way:_
```html
<div class="{{ style.myClassName }}" />
```

### Components

A component is the content of an HTML tag `<template>`. It can only have a
single child.

#### Default component

Each file must contain at most one default component. A default component is the
main component of the file.

**Usage**
```html
<template default [id]>
  <!-- Content -->
</template>
```

**Attributes**
  * `default`: Flag the component as default,
  * `id` _(Optional)_: Tag name to use to reference this component. Also used
    to set the `displayName` of the component for debug purpose.

**Example**
```html
<template default id="hello-world">
  <div>Hello World</div>
</template>
```

_Is equivalent in React to:_
```js
export default function HelloWorld() {
  return (
    <div>Hello World</div>
  );
}
HelloWorld.displayName = 'HelloWorld';
```

#### Named components

A named component is simply a `<template>` tag with an `id` attribute, which
means it can be used by referencing its name. All named components will be
exported under their given name.

**Usage**
```html
<template id>
  <!-- Content -->
</template>
```

**Attributes**
  * `id`: Tag name to use to reference this component. Also used
    to set the `displayName` of the component for debug purpose.

**Example**
```html
<template id="named-component">
  <!-- ...  -->
</template>

<template default>
  <!-- ...  -->
  <named-component />
  <!-- ...  -->
</template>
```

_Is equivalent in React to:_
```js
export function NamedComponent(props) {
  return (
    // ...
  );
}
NamedComponent.displayName = 'NamedComponent';

export default function(props) {
  return (
    // ...
    <NamedComponent />
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
<template default>
  <div class="users">
    <render for-each="{{ props.users }}" as="{{ user }}">
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
<template default>
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

Props spreading is used to simplify the component so the focus can be kept on
the UI.

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
<template default>
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
<template default>
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
      Clicked { props.clicks } time(s)
    </button>
  );
}
```

# License

MIT.
