# react-html-template-loader

> A Webpack loader allowing imports of HTML templates as if they were React
> components.

**This project is a Proof of Concept** that it is possible to write React pure
functional components like HTML5 templates, _almost_ as a Web Component.

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

Add the react-html-template-loader to your _webpack.config.js_:
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

## Background

_Why this POC?_

React provides a great developing experience, you finally have a strong
integration between the JavaScript code and the template syntax, it feels
natural to write.

But this merge isn't that good for designers who just know enough HTML and,
depending on the requirements, it can be a disqualifying criteria for React.

Thanks to the pure functional components and the [Presentational and Container
pattern](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.b4xio9vw9),
 most components are simply templates having data as input and some UI
as output. What if those pure functional templates could simply be written in
HTML to be easily created and modified by designers?

The purpose of this POC is to show that **it is possible to use HTML components
as a React pure functional component**.

**react-html-template-loader** reconcile developers and designers. It is a
Webpack loader compiling HTML templates into pure functional React components.

## API

### Imports

#### Default import

Import the default export of a file.

**Usage**
```html
<link href as />
```

**Attributes**
  * `href`: Path of the file to import,
  * `as`: Name to use to reference the default export of the file.

**Example**
```html
<link href="path/to/component" as="my-component" />
```

_Is equivalent in ES2015 to:_
```js
import MyComponent from 'path/to/component';
```

#### Named imports

Import an export by its name. The `<link>` tag for a named import must be
child of an other `<link>` tag having a `href` attribute.

**Usage**
```html
<link href>
  <link name as />
</link>
```

**Attributes**
  * `href`: Path of the file to import,
  * `name`: Name of the variable to import,
  * `as`: Name to use to reference the export.

**Example**
```html
<link href="path/to/component">
  <link name="{{ ANamedImport }}" as="a-named-import" />
  <link name="{{ AnohterNamedImport }}" as="my-component" />
</link>
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
<link href as>
  <link href as />
</link>
```

**Attributes**
  * _See [default imports](#default-import) and [named imports](#named-imports)._

**Example**
```html
<link href="path/to/component" as="my-component">
  <link name="{{ ANamedImport }}" as="a-named-import" />
  <link name="{{ AnohterNamedImport }}" as="my-component" />
</link>
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

A named template is simply a template with an `id` attribute, which means it
can be used by referencing its name. All named templates will be exported under
their given name.

**Usage**
```html
<template id>
  <!-- Content -->
</template>
```

**Attributes**
  * `id`: Tag name to use to reference this template.

**Example**
```html
<template id="named-template">
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

# License

MIT.
