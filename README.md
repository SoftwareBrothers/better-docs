<img src="./readme/logo.png" />

A Documentation toolbox for your **javascript** / **typescript**, **react**, or **react-native** projects based on JSDoc3 with tags such as
**@category**, **@component**, **@lifecycle**, **@renders**, **@table**, **@optional**, **@inheritDesc**, **@inheritSummary**, **@inheritProperties**,
and **@inheritParams** plugins. This template also implements several helpful options to better control the behavior of the generated web documentation
such as, nested categorization with accordian style folding, automatically opening external `@link` tags in a new browser tab, and inheriting
documentation from parent(s) in extended classes.

# OpenSource SoftwareBrothers community

- [Join the community](https://join.slack.com/t/adminbro/shared_invite/zt-czfb79t1-0U7pn_KCqd5Ts~lbJK0_RA) to get help and be inspired.
- subscribe to our [newsletter](http://opensource.softwarebrothers.co)

# Contents
- [Example](#example)
- [Theme Installation](#theme-installation)
- [Theme Usage](#theme-usage)
- [Template Options](#template-options)
  - [Options List](#template-options-option-list)
  - [Using Template Options](#using-template-options)
- [TypeScript Support](#typescript-support)
  - [Installation](#typescript-support-installation)
  - [How It Works](#typescript-support-how-it-works)
  - [Examples](#typescript-support-examples)
- Plugins
  - [@category Plugin](#category-plugin)
    - [Inatallation](#category-plugin-installation)
    - [Usage](#category-plugin-usage)
  - [@component Plugin](#component-plugin)
    - [Installation](#component-installation)
    - [Usage](#component-usage)
    - [Preview](#component-preview)
    - [Mixing Components In Preview](#component-mixing-components-in-preview)
    - [Wrapper Component](#component-wrapper-component)
      - [Installation](#component-wrapper-component-installation)
      - [Usage](#component-wrapper-component-usage)
    - [Styling React Examples](#component-styling-react-examples)
    - [Adding commands to bundle entry file](#component-adding-commands-to-bundle-entry-file)
  - [@lifecycle Plugin](#lifecycle-plugin)
    - [Installation](#lifecycle-installation)
    - [Usage](#lifecycle-usage)
  - [@table Plugin](#table-plugin)
    - [Installation](#table-installation)
    - [Usage](#table-usage)
  - ['inheritable' Plugin](#inheritable-plugin)
    - [Installation](#inheritable-installation)
    - [Supported Tags](#inheritable-supported-tags)
    - [Usage](#inheritable-usage)
      - [Using With Standard Tags](#inheritable-using-with-standard-tags)
      - [Value Inheritance](#inheritable-value-inheritance)
      - [Params](#inheritable-params)
    - [Examples](#inheritable-examples)
  - ['@typedef import' Plugin](#typedef-import-plugin)
    - [Installation](#typedef-import-installation)
- [Setting Up For Development](#setting-up-for-development)
- [License](#license)

<a name="example"></a>
# Example

Example documentation can be found here: [](https://softwarebrothers.github.io/example-design-system/index.html)

This is how it looks:

<table>
  <tr>
    <td>
      <a href='./readme/class.png'><img src="./readme/class.png" style="width: 300px"/></a>
    </td>
    <td>
      <a href='./readme/with-mermaid.png'><img src="./readme/with-mermaid.png" style="width: 300px"/></a>
    </td>
    <td>
      <a href='./readme/component.png'><img src="./readme/component.png" style="width: 300px"/></a>
    </td>
  </tr>
</table>

<a name="theme-installation"></a>
# Theme Installation

```sh
npm install --save-dev better-docs
```

<a name="theme-usage"></a>
# Theme Usage

## With command line

Assuming that you have [jsdoc](https://github.com/jsdoc/jsdoc) installed globally:

```
jsdoc your-documented-file.js -t ./node_modules/better-docs
```

## With npm and configuration file

In your projects package.json file - add a new script:

```
"script": {
  "docs": "jsdoc -c jsdoc.json"
}
```

in your `jsdoc.json` file, set the template:

```json
"opts": {
  "template": "node_modules/better-docs"
}
```

<a name="template-options"></a>
# Template Options

First of all, let me state that better-docs extends the `default` template. That is why default template parameters can be used in addition to the template options
provided by better-docs.

To customize the better-docs pass `options` to `templates['better-docs']`. section in your `jsdoc configuration file`.

<a name="template-options-option-list"></a>
## Option List

[BETA]: You must explicitly set the `search` option of the `default` template to `true` to enable search

better-docs has several template options which are helpful in controlling the way documentation generation behaves:
- `name` - Text to be used as the "site title" in the header of the generated docs
- `logo` - The path to a logo to include in the top navigation header of the generated docs
- `title` - Text to be used as the `<title>` in the `<head>` of the generated docs
- `css` - Path to a CSS file to be included in the generated docs. The path is relative to the `jsdoc.json` configuration file
- `trackingCode` - A string containing tracking code to include in the <head> of each page. It should include `<script>` tags if they are needed.
- `hideGenerator` - Boolean indicating if the 'Generated By' text should be excluded from the footer
- `navLinks` - An array of objects defining links to be included in the navigation dropdown
  - `navLinks[...].label` - The link text
  - `navLinks[...].href` - The link URL
- `head` - A string of HTML to be included in the `<head>` of each page
- `navButtons` - An array of objects defining buttons that should be added to the top nav of the generated docs
  - `navButtons[...].label` - The link text
  - `navButtons[...].href` - The link URL
  - `navButtons[...].target` - The value of the `target` attribute (i.e. Given `navButtons[...].target: "_new"` the anchor will be `<a target="_new" />`)
  - `navButtons[...].className` - A css class to include on the anchor
- `landing` - Boolean value. If true the landing page will be `docs.html`, otherwise it will be `index.html`
- `component` - An object to customize how the `@component` tag works. See [@component](#component-plugin-beta) documentation below
  - `component.wrapper` - Add a wrapper component (such as a context provider) See [Wrapper component](#wrapper-component-only-react) documentation below
  - `component.entry` - Add to the `.entry.js` file created by `@component`. This property is an array of strings. See
    [Adding commands to bundle entry file](#adding-commands-to-bundle-entry-file)
- `useNestedCategories` - Used in conjunction with the @category plugin. Determines if the navigation should nest into `@category` -> `@subcategory` -> type.
  defaults to false
- `isReactNative` - Used in conjunction with the @category plugin. When set to true the live preview is diabled since it won't work, which speeds up building
  the docs and removes errors. Defaults to false
- `maxPropertyDepth` - Used to limit the depth that properties display when objects are defined. Defaults to 2. For example:
```
//maxPropertyDepth is set to 2
@property {Object} myObject
@property {Object} myObject.property1
@property {Object} myObject.property1.depth3
@property {Object} myObject.property1.depth4
@property {Object} myObject.property2
@property {Object} myObject.property2.anotherProp2

//Renders as
// myObject
//   - property1
//      - depth3
//      - depth3.depth4      <--- maxPropertyDepth of 2 limits the nesting
//   - property2
//      - anotherProp2
```
- `useNavFolding` - When true, you are able to fold the contents of the navigation - The folded state of each item persists across pages. Defaults to false
- `usePropertyFolding` - When true, you are able to fold nested object properties. Defaults to false.
- `foldingDefaultClosed` - Used When `useNavFolding` and/or `usePropertyFolding` are set to true. If this option is set to true the folding begins closed.
- `linkTagToNewTab` - When set to true, all `{@link http[s]://}` tags will automatically open in a new tab
- `subsectionsInSideNav` - An array of all the subsections to add to the **right** navigation. Defaults to []; Valid values are
  - `augments` - Extends
  - `requires` - Requires
  - `classes` - Classes
  - `interfaces` - Interfaces
  - `mixins` - Mixins
  - `namespaces` - Namespaces
- `includeTodoPage` - Boolean to determine if a "To Do" list page should be generated along with the documentation. This list will include all `@todo` tags defined
anywhere in the system and are categorized by the file in which they appear.

<a name="using-template-options"></a>
## Using Template Options

All options can be set in the `jsdoc.json` file. Below is a sample of the `jsdoc.json` configuration with settings for both `default` and `better-docs` templates:

```json
  {
    "tags": {
        "allowUnknownTags": ["category"]
    },
    "source": {
        "include": ["./src"],
        "includePattern": ".js$",
        "excludePattern": "(node_modules/|docs)"
    },
    "plugins": [
        "plugins/markdown",
        "jsdoc-mermaid",
        "node_modules/better-docs/category"
    ],
    "opts": {
        "encoding": "utf8",
        "destination": "docs/",
        "readme": "readme.md",
        "recurse": true,
        "verbose": true,
        "tutorials": "./docs-src/tutorials",
        "template": "better-docs"
    },
    "templates": {
      "cleverLinks": false,
      "monospaceLinks": false,
      "search": true,
      "default": {
        "staticFiles": {
          "include": [
            "./docs-src/statics"
          ]
        }
      },
      "better-docs": {
        "name": "AdminBro Documentation",
        "logo": "images/logo.png",
        "title": "", //HTML title
        "css": "style.css",
        "trackingCode": "tracking-code-which-will-go-to-the-HEAD",
        "hideGenerator": false,
        "navLinks": [
          {
            "label": "Github",
            "href": "https://github.com/SoftwareBrothers/admin-bro"
          },{
            "label": "Example Application",
            "href": "https://admin-bro-example-app.herokuapp.com/admin"
          }
        ],
        "navButtons": [
          {
            "label": "Page 1",
            "href": "/page1.html",
            "target": "",
            "className": "header-button"
          },{
            "label": "External Page",
            "href": "https://external.link",
            "target": "_new",
            "className": "header-button external-button"
          }
        ],
        "landing": true,
        "component": {
          "wrapper": "./path/to/your/wrapper-component.js",
          "entry": [
            "import 'babel-polyfill';",
            "import 'bulma/css/bulma.css';"
          ]
        },
        "useNestedCategories": true,
        "isReactNative": true,
        "maxPropertyDepth": 10,
        "useNavFolding": true,
        "usePropertyFolding": true,
        "foldingDefaultClosed": true,
        "linkTagToNewTab":true,
        "subsectionsInSideNav": ["augments","requires","classes","interfaces","mixins","namespaces"],
        "includeTodoPage": true
      }
    }
  }
...
```

<a name="typescript-support"></a>
# TypeScript support

better-docs has a plugin which allows you to generate documentation from your TypeScript codebase.

<a name="typescript-support-installation"></a>
## Installation

To use it update your `jsdoc.json` file

```
...
"tags": {
    "allowUnknownTags": ["optional"] //or true
},
"plugins": [
    "node_modules/better-docs/typescript"
],
"source": {
    "includePattern": "\\.(jsx|js|ts|tsx)$",
},
...
```

And now you can run your `jsdoc` command and parse TypeScript files.

<a name="typescript-support-how-it-works"></a>
## How it works?

It performs 4 operations:

* First of all it transpiles all .ts and .tsx files to .js, so that all comments used by you are treated
as a regular JSDoc comments.

Furthermore it:

* Converts all your commented `type` aliases to `@typedef`
* Converts all your commented `interface` definitions to `@interface`,
* Converts descriptions for your public, protected, static class members

so they can be printed by JSDoc automatically.

<a name="typescript-support-examples"></a>
## Examples

```
/**
 * ActionRequest
 * @memberof Action
 * @alias ActionRequest
 */
export type ActionRequest = {
  /**
   * parameters passed in an URL
   */
  params: {
    /**
     * Id of current resource
     */
    resourceId: string;
    /**
     * Id of current record
     */
    recordId?: string;
    /**
     * Name of an action
     */
    action: string;

    [key: string]: any;
  };
}
```

is converted to:

```
/**
 * ActionRequest'
 * @memberof Action'
 * @alias ActionRequest'
 * @typedef {object} ActionRequest'
 * @property {object} params   parameters passed in an URL'
 * @property {string} params.resourceId   Id of current resource'
 * @property {string} [params.recordId]   Id of current record'
 * @property {string} params.action   Name of an action'
 * @property {any} params.{...}'
 */
```

Also you can comment the interface in a similar fashion:

```
/**
 * JSON representation of an {@link Action}
 * @see Action
 */
export default interface ActionJSON {
  /**
   * Unique action name
   */
  name: string;
  /**
   * Type of an action
   */
  actionType: 'record' | 'resource' | Array<'record' | 'resource'>;
  /**
   * Action icon
   */
  icon?: string;
  /**
   * Action label - visible on the frontend
   */
  label: string;
  /**
   * Guarding message
   */
  guard?: string;
  /**
   * If action should have a filter (for resource actions)
   */
  showFilter: boolean;
  /**
   * Action component. When set to false action will be invoked immediately after clicking it,
   * to put in another words: there wont be an action view
   */
  component?: string | false | null;
}
```

or describe your class properties like that:

```
/**
 * Class name
 */
class ClassName {
  /**
   * Some private member which WONT be in jsdoc (because it is private)
   */
  private name: string

  /**
   * Some protected member which will go to the docs
   */
  protected somethingIsA: number

  /**
   * And static member which will goes to the docs.
   */
  static someStaticMember: number

  public notCommentedWontBeInJSDoc: string

  constructor(color: string) {}
}
```
<a name="category-plugin"></a>
# @category plugin

better-docs also allows you to nest your documentation into categories and subcategories in the sidebar menu.

<a name="category-plugin-installation"></a>
## Installation

To add a plugin - update `plugins` section in your `jsdoc.json` file:

```
...
"tags": {
    "allowUnknownTags": ["category"] //or true
},
"plugins": [
    "node_modules/better-docs/category"
],
...
```
<a name="category-plugin-usage"></a>
## Usage

Once installed, you can use `@category` and/or `@subcategory` tag in your code:

```
/**
 * Class description
 * @category Category
 * @subcategory All
 */
class YourClass {
  ....
}
```

<a name="component-plugin"></a>
# @component plugin [BETA]

Better-docs also allows you to document your [React](https://reactjs.org/) and [Vue](https://vuejs.org/) components automatically. The only thing you have to do is
to add a `@component` tag. It will take all props from your components and along with an `@example` tag - will generate a __live preview__.

<a name="component-installation"></a>
## Installation instructions

Similar as before to add a plugin - you have to update the `plugins` section in your `jsdoc.json` file:

```
...
"tags": {
    "allowUnknownTags": ["component"] //or true
},
"plugins": [
    "node_modules/better-docs/component"
],
...
```

When the `isReactNative` template option is not set to `true` (which disables live preview), the __component__ plugin will use [parcel](https://parceljs.org) as a
bundler so you have to install it globally. To do this run:

```
# if you use npm
npm install -g parcel-bundler

# or yarn
yarn global add parcel-bundler
```
<a name="component-usage"></a>
## Usage

To document components simply add `@component` in your JSDoc documentation:

```jsx
/**
 * Some documented component
 *
 * @component
 */
const Documented = (props) => {
  const { text } = props
  return (
    <div>{text}</div>
  )
}

Documented.propTypes = {
  /**
   * Text is a text
   */
  text: PropTypes.string.isRequired,
}

export default Documented
```

The plugin will take the information from your [PropTypes](https://reactjs.org/docs/typechecking-with-proptypes.html) and put them into an array.

For Vue it looks similar:

```vue
<script>
/**
 * @component
 */
export default {
  name: 'ExampleComponent',
  props: {
    spent: {
      type: Number,
      default: 30,
    },
    remaining: {
      type: Number,
      default: 40,
    }
  },
}
</script>
```

In this case, props will be taken from `props` property.

<a name="component-preview"></a>
## Preview

`@component` plugin also modifies the behaviour of `@example` tag in a way that it can generate an actual __component preview__. What you have to do is to add
an `@example` tag and return component from it:

### React example:

```jsx
/**
 * Some documented component
 *
 * @component
 * @example
 * const text = 'some example text'
 * return (
 *   <Documented text={text} />
 * )
 */
const Documented = (props) => {
  ///...
}
```

### Vue example 1:

```vue
<script>
/**
 * @component
 * @example
 * <ExampleComponent :spent="100" :remaining="50"></ExampleComponent>
 */
export default {
  name: 'ExampleComponent',
  //...
}
</script>
```

### Vue example 2:

```vue
<script>
/**
 * @component
 * @example
 * {
 *   template: `<Box>
 *     <ProgressBar :spent="spent" :remaining="50"></ProgressBar>
 *     <ProgressBar :spent="50" :remaining="50" style="margin-top: 20px"></ProgressBar>
 *   </Box>`,
 *   data: function() {
 *     return {spent: 223};
 *   }
 * }
 */
export default {
  name: 'ExampleComponent',
  //...
}
</script>
```

### Multiple Examples and Captions

You can put as many `@example` tags as you like in one component and "caption" each of them like this:

```javascript
/**
 * @component
 * @example <caption>Example usage of method1.</caption>
 * // your example here
 */
```
<a name="component-mixing-components-in-preview"></a>
## Mixing components in preview

Also you can use multiple components which are documented with `@component` tag together. So lets say you have 2 components and in the second component you want to
use the first one as a wrapper like this:

```javascript
// component-1.js
/**
 * Component 1
 * @component
 *
 */
const Component1 = (props) => {...}

// component-2.js
/**
 * Component 2
 * @component
 * @example
 * return (
 *   <Component1>
 *     <Component2 prop1={'some value'}/>
 *     <Component2 prop1={'some other value'}/>
 *   </Component1>
 * )
 */
const Component2 = (props) => {...}
```
<a name="component-wrapper-component"></a>
## Wrapper component [only React]

Most probably your components will have to be run within a particular context, like within redux store provider or with custom CSS libraries. Better Docs achieves this by
allowing you to add a wrapper component to your components.

<a name="component-wrapper-component-installation"></a>
### Installation
You can simulate running in a context or redux store provider by passing a `component.wrapper` in your `jsdoc.json`:
_(To read more about passing options - See the [Template Options](#template-options) section)_

```json
// jsdoc.json
{
    "opts": {...},
    "templates": {
        "better-docs": {
            "name": "AdminBro Documentation",
            "component": {
              "wrapper": "./path/to/your/wrapper-component.js",
            },
            "...": "...",
        }
    }
}
```

<a name="component-wrapper-component-usage"></a>
### Usage

Wrapper component can look like this:

```javascript
// wrapper-component.js
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

const store = createStore(() => ({}), {})

const Component = (props) => {
  return (
    <React.Fragment>
      <head>
        <link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.css" />
      </head>
      <Provider store={store}>
        <BrowserRouter>
          {props.children}
        </BrowserRouter>
      </Provider>
    </React.Fragment>
  )
}

export default Component
```
<a name="component-styling-react-examples"></a>
## Styling React examples

Better-docs inserts all examples within an `iframe`. This results in the following styling options:

1. If you pass styles inline - they will work right away.

2. For `css modules` to work with `parcel` bundler - you have to install `postcss-modules` package:

```
yarn add postcss-modules
```

and create a `.postcssrc` file:


```json
// .postcssrc
{
	"modules": true
}
```

3. For [styled-components](https://www.styled-components.com/) you have to use wrapper component which looks like this:

```jsx
import React from 'react'
import { StyleSheetManager } from 'styled-components'

const Component = (props) => {
  const { frameContext } = props
  return (
    <StyleSheetManager target={frameContext.document.head}>
      {props.children}
    </StyleSheetManager>
  )
}

export default Component
```
<a name="component-adding-commands-to-bundle-entry-file"></a>
## Adding commands to bundle entry file

`@component` plugin creates an entry file: `.entry.js` in your _docs_ output folder. Sometimes you might want to add something to it. You can do this by passing:
`component.entry` option, which is an array of strings.

So let's say you want to add `babel-polyfill` and 'bulma.css' framework to your bundle. You can do it like this:

```json
// jsdoc.json
{
    "opts": {...},
    "templates": {
        "better-docs": {
            "name": "AdminBro Documentation",
            "component": {
                "entry": [
                    "import 'babel-polyfill';",
                    "import 'bulma/css/bulma.css';"
                ]
            },
            "...": "...",
        }
    }
}
```
<a name="lifecycle-plugin"></a>
# @lifecycle plugin

better-docs creates the `@lifecycle` tag, which will label tagged methods and sort them into their own categories in the right navigation.

This plugin also implements the `@renders` tag so you can tag methods which cause the component to render. This tag simply adds a label to the method.

**Note** This plugin requires the use of the `@component` plugin

<a name="lifecycle-installation"></a>
## Installation

To add the `@lifecycle` plugin - update `plugins` section in your `jsdoc.json` file:

```
...
"tags": {
    "allowUnknownTags": ["lifecycle", "renders"] //or true
},
"plugins": [
    "node_modules/better-docs/lifecycle"
],
...
```

<a name="lifecycle-usage"></a>
## Usage
Once installed you can use `@lifecycle` and/or `@renders` tag in your code:

```
class YourClass {
  ....
  /**
  * This is an example method
  * 
  * @lifecycle
  * @renders
  */
  yourMethod(){
  
  }
}
```

<a name="table-plugin"></a>
# @table plugin

better-docs creates the `@table` tag, which is a logical separator of members for defining tables in a database. Using this tag will separate those members
tagged with `@table` into it's own section in the documentation, making the docs less cluttered and easier to read. You will define a table's schema as a
`@typedef` just as you do any other typedef, including the `@table` table tag to indicate that this typedef should be documented in the "Tables" section.
This table definition will be rendered the same as any other `@typedef`, except it will be grouped into a "Table" section with any other tables.

<a name="table-installation"></a>
## Installation

To add the `@table` plugin - update `plugins` section in your `jsdoc.json` file:

```
...
"tags": {
    "allowUnknownTags": ["table"] //or true
},
"plugins": [
    "node_modules/better-docs/table"
],
...
```

<a name="table-usage"></a>
## Usage

Once installed you can use the `@table` tag in your code:

```
  /**
  * @summary Definition of YourTable
  *
  * This is an example typedef for defining the `YourTable` database table
  * 
  * @typedef {object} YourTable
  * @table
  *
  * @property {string} name='YourTable'               The name of the table
  * @property {object} indexes                        A list of all the indexes for this table
  * @property {object} indexes.myIndex                The myIndex index
  * @property {object} indexes.myIndex.primary=false  myIndex is not a primary key
  * ...
  * @property {object} fields                         All the fields in the `YourTable` database table
  * @property {object} fields.id                      The `id` field
  * @property {bool}   fields.id.nullable=false       The `id` field is not nullable
  * ...
  * 
  */
```
<a name="inheritable-plugin"></a>
# inheritable Plugin

better-docs creates several tags that allow you to inhert documentation in a child class from it's parent making it quick and easy to reuse documentation
without the need to repeat it in child classes. This speeds up the documentation process, and keeps param definitions consistent.

<a name="inheritable-installation"></a>
## Installation

To add the `inheritable` plugin - update `plugins` section in your `jsdoc.json` file:

```
...
"tags": {
    "allowUnknownTags": ["inheritDesc", "inheritSummary", "inheritParams"] //or true
},
"plugins": [
    "node_modules/better-docs/inheritable"
],
...
```

<a name="inheritable-supported-tags"></a>
## Supported Tags
- `@inheritDesc <additional description>` - The `@inheritDesc` tag can either be used in conjunction with [@desc](https://jsdoc.app/tags-description.html),
  or replace it entirely. Additionally, providing a value will append that value to the description from the inherited doclet.

- `@inheritSummary <additional summary>` - The `@inheritSummary` tag can either be used in conjunction with [@summary](https://jsdoc.app/tags-summary.html),
  or replace it entirely to inherit the summary from the parent doclet. Additionally, providing a value will append that value to the summary from the inherited
  doclet.

- `@inheritParams` - The `@inheritParams` tag is used in conjunction with the [@param](https://jsdoc.app/tags-param.html) tag. It can be used to inherit params
  from the parent doclet, and/or modify a param inherited from the parent.

- `@inheritProperties` - The `@inheritProperties` tag is used in conjunction with the [@property](https://jsdoc.app/tags-property.html) tag. It can be used to
  inherit properties from the parent doclet, and/or modify a property inherited from the parent. This tag behaves exactly like the `@inheritParams`, but is used
  to inherit `@property` tags instead of `@param` tags.

<a name="inheritable-usage"></a> 
## Usage

<a name="inheritable-using-with-standard-tags"></a>
### Using with standard tags

These tags can replace their standard `jsdoc` counterparts, or be used to augment them (i.e. within the same docblock you can replace `@summary` with
`@inheritSummary`, or you can use them both together). When the `inheritable` tags are used in conjunction with their standard `jsdoc` counterparts, the generated
documentation will be positional. This means that where you place the `inheritable` tag relative to it's `jsdoc` counterpart will determine where the rendered
documentation will be placed. For instance, when using both the `@summary` and `@inheritSummary` tags, if the `@summary` tag comes before the `@inheritSummary`,
then the **inherited** documentation will be placed **after** the `@summary`, and vice versa. See Examples, especially 1 & 2.

<a name="inheritable-value-inheritance"></a>
### Value Inheritance

These tags follow the same logic of inheritance as a method or property of a class, where the value of the tag will be inherited from the first parent in the
inheritance tree which defines that value. For instance, using the `@inheritDesc` tag on a method will first look to it's immediate parent(s) for a method of
the same name, and inherit it's `@desc` **AND** `@inheritDesc` values. If the immediate parent does not have a method with the same name (or if that method does
not contain a `@desc` or `@inheritDesc` value), then it will look to the parent's parent to find a value, and so on, until either a value is found, or the top
of the tree is reached. If the **child** class's parent implements the `@inheritDesc` tag then the value for the **child** class will be inherited from it's
**grandparent** including any additions the **parent** class made to the value it inherited from it's parent (the child's **grandparent**), and so on. See Examples.

<a name="inheritable-params"></a>
### Params

When using the `@inheritParams` or `@inheritProperties` tag, in addition to inheriting params from the parent you can use it in conjunction with the `@param`/`@property` tag
to add to or overwrite the params defined on the parent. When a param on the **child** class has the same name as a param on the **parent** class, the **childs** param will
be used. When a param on the **child** class has a different name than a param on the **parent** class, **BOTH** params will be used. See Examples, especially Example 5.

<a name="inheritable-examples"></a>
## Examples

### Example 1:

To demonstrate the order of rendered documentation when using `inheritance` tags AND standard `jsdoc` tags, given the following class declarations:

```
class Parent{
    /**
     * @summary This is the parent myMethod summary.
     */
    myMethod(){
        ...
    }
}

//FirstChild defines it's own summary, and THEN inherits the summary from Parent
class FirstChild extends Parent{
    /**
     * @summary This is the first child's myMethod summary.
     * @inheritSummary
     */
    myMethod(){
        ...
    }
}

//SecondChild inherits the entire summary from Parent (via FirstChild), and THEN defines it's own summary
class SecondChild extends FirstChild{
    /**
     * @inheritSummary
     * @summary This is the second child's myMethod summary.
     */
    myMethod(){
        ...
    }
}
```

- **The `Parent` class summary will be:<br>**

  `This is the parent myMethod summary.`<br><br>

- **The `FirstChild` class summary will be:<br>**

  `This is the first child's myMethod summary.`<br>
  `This is the parent myMethod summary!`<br><br>

- **The `SecondChild` class summary will be:<br>**

  `This is the parent myMethod summary.`<br>
  `This is the second child's myMethod summary.`<br>

### Example 2:

To demonstrate using `inheritance` tags with a value AND standard `jsdoc` tags, given the following class declarations:

```
class Parent{
    /**
     * @desc This is the parent myMethod description.
     */
    myMethod(){
        ...
    }
}

//FirstChild defines it's own description, and THEN inherits the description from Parent and adds to it
class FirstChild extends Parent{
    /**
     * @desc This is the first child's myMethod description.
     * @inheritDesc Here is some additional description text from FirstChild
     */
    myMethod(){
        ...
    }
}

//SecondChild inherits the description from Parent (via FirstChild) and the extended description from
//FirstChild, and THEN defines it's own desctiption
class SecondChild extends FirstChild{
    /**
     * @inheritDesc
     * @desc Here is some additional description text from SecondChild
     */
    myMethod(){
        ...
    }
}
```

- **The `Parent` class description will be:<br>**

  `This is the parent myMethod description.`<br><br>

- **The `FirstChild` class description will be:<br>**

  `This is the first child's myMethod description.`<br>
  `This is the parent myMethod description.`<br>
  `Here is some additional description text from FirstChild`<br><br>

- **The `SecondChild` class summary will be:<br>**

  `This is the first child's myMethod description.`<br>
  `This is the parent myMethod description.`<br>
  `Here is some additional description text from FirstChild`<br>
  `Here is some additional description text from SecondChild`<br><br>

### Example 3:

To demonstrate using `inheritable` tags WITHOUT a value, given the following class declarations:

```
class Parent{
    /**
     * @desc This is the parent myMethod description.
     */
    myMethod(){
        ...
    }
}

//FirstChild will inherit it's description from Parent
//Unlike in example 4, myMethod WILL have a description
class FirstChild extends Parent{
    /** @inheritDesc */
    myMethod(){
        ...
    }
}

//SecondChild inherits the description from Parent (via FirstChild), and adds to it
class SecondChild extends FirstChild{
    /**
     * @inheritDesc Here is a description using the "inheritDesc" tag on SecondChild
     */
    myMethod(){
        ...
    }
}
```

- **The `Parent` class description will be:<br>**

  `This is the parent myMethod description.`<br><br>

- **The `FirstChild` class description will be:<br>**

  `This is the parent myMethod description.`<br><br>

- **The `SecondChild` class summary will be:<br>**

  `This is the parent myMethod description.`<br>
  `Here is a description using the "inheritDesc" tag on SecondChild`<br><br>
  
### Example 4:

To demonstrate inheritance when a parent method has no description, given the following class declarations:

```
class Parent{
    /**
     * @desc This is the parent myMethod description.
     */
    myMethod(){
        ...
    }
}

//FirstChild does not implement a description, so it will be skipped when searching for a value
class FirstChild extends Parent{

    myMethod(){
        ...
    }
}

//SecondChild inherits the description directly from Parent
class SecondChild extends FirstChild{
    /**
     * @inheritDesc
     */
    myMethod(){
        ...
    }
}
```

- **The `Parent` class description will be:<br>**

  `This is the parent myMethod description.`<br><br>

- **The `FirstChild` class will not have a description**

- **The `SecondChild` class summary will be:<br>**

  `This is the parent myMethod description.`<br>
  
### Example 5:

To demonstrate the usage of the `@inheritParams` tag, given the following class declarations:

```
class Person{
    name;
    
    /**
     * @param {string}  name  This is the person's name
     */
    update(name){
        this.name=name;
        ...
    }
}

//PersonWithAddress inherits the "name" param from Person, and adds the "address" param after
class PersonWithAddress extends Person{
    address;
    /**
     * @inheritParams
     * @param {string}  address  This is the person's address
     */
    update(name, address){
        this.address = address;
        Person.prototype.update(name);
        ...
    }
}

//Notice "phone" is the FIRST parameter in update(), and @inheritParams is placed AFTER it in the docblock
//Also notice that we have updated the description on the "name" param
//PersonWithAddressAndPhone adds the "phone" param, updates the "name" description and THEN inherits the "address" param from Person (via PersonWithAddress)
class PersonWithAddressAndPhone extends PersonWithAddress{
    phone;
    /**
     * @param {string}  phone  This is the person's phone number
     * @param {string}  name   This is an updated description for the person's name
     * @inheritParams
     */
    update(phone, name, address){
        this.phone = phone;
        PersonWithAddress.prototype.update(name, address);
        ...
    }
}
```

- **The `Person` class param declaration will effectively be:<br>**

```
/**
 * @param {string}  name  This is the person's name
 */
```

- **The `PersonWithAddress` class param declaration will effectively be:<br>**

```
/**
 * @param {string}  name     This is the person's name
 * @param {string}  address  This is the person's address
 */
```

- **The `PersonWithAddressAndPhone` class param declaration will effectively be:<br>**

```
/**
 * @param {string}  phone    This is the person's phone number
 * @param {string}  name     This is an updated description for the person's name
 * @param {string}  address  This is the person's address
 */
```

<a name="typedef-import-plugin"></a>
# typedef(import(...)) Plugin

better-docs also has one extra plugin for handling typescript-like imports (it has to be one-liner) such as:

```
/** @typedef {import('./some-other-file').ExportedType} ExportedType */
```

It simply removes that from the code so JSDoc won't throw an error. 

<a name="typedef-import-installation"></a>
## Installation

In order to use it add this plugin to your plugins section:

```
  "plugins": [
        "node_modules/better-docs/typedef-import"
    ],
```

<a name="setting-up-for-development"></a>
# Setting up for the development

If you want to change the theme locally follow the steps:

1. Clone the repo to the folder where you have the project:

```
cd your-project
git clone git@github.com:SoftwareBrothers/better-docs.git
```

or add it as a git submodule:

```
git submodule add git@github.com:SoftwareBrothers/better-docs.git
```

2. Install the packages

```
cd better-docs

npm install

# or

yarn
```

3. Within the better-docs folder run the gulp script. It will regenerate documentation every time you change something.

It supports following EVN variables:

* `DOCS_COMMAND` - a command in your root repo which you use to generate documentation: i.e. `DOCS_COMMAND='jsdoc -c jsdoc.json'` or `npm run docs` if you have
  `docs` command defined in `package.json` file
* `DOCS_OUTPUT` - where your documentation is generated. It should point to the same folder your jsdoc `--destination` conf. But make sure that it is relative to
  the path where you cloned `better-docs`.
* `DOCS` - list of folders from your original repo what you want to watch for changes. Separated by comma.

```
cd better-docs
DOCS_COMMAND='npm run docs' DOCS=../src/**/*,../config/**/* DOCS_OUTPUT=../docs cd better-docs && gulp
```

The script should launch the browser and refresh it whenever you change something in the template or in `DOCS`.

# Setting up the jsdoc in your project

If you want to see how to setup jsdoc in your project - take a look at these brief tutorials:

- JSDoc - https://www.youtube.com/watch?v=Yl6WARA3IhQ
- better-docs and Mermaid: https://www.youtube.com/watch?v=UBMYogTzsBk

<a name="license"></a>
# License

better-docs is Copyright © 2019 SoftwareBrothers.co. It is free software and may be redistributed under the terms specified in the [LICENSE](LICENSE) file - MIT.

# About SoftwareBrothers.co

<img src="https://softwarebrothers.co/assets/images/software-brothers-logo-full.svg" width=240>


We're an open, friendly team that helps clients from all over the world to transform their businesses and create astonishing products.

* We are available for [hire](https://softwarebrothers.co/contact).
* If you want to work for us - check out the [career page](https://softwarebrothers.co/career).
