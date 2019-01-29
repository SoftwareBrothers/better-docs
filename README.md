# better-docs

Beautiful and simple documentation template for JSDoc 3 with @category plugin.

<img src="./readme/class.png" />
<img src="./readme/with-mermaid.png" />

## Example

Simple example documentation can be found here: https://softwarebrothers.github.io/admin-bro-dev/index.html

## Installation

```sh
npm install --save-dev better-docs
```

## Theme Usage

### With command line

Assuming that you have jsdoc installed globally:

```
jsdoc your-documented-file.js -t ./node_modules/better-docs
```

### With npm and configuration file

In your projects package.json file add a new script:

```
"script": {
  "docs": "node_modules/.bin/jsdoc -c jsdoc.json"
}
```

in your `jsdoc.json` file, set the template:

```json
"opts": {
  "template": "node_modules/better-docs"
}
```

## @category plugin

better-docs also allows you to nest your documentation into a categories in the side bar menu.

### Usage

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

and then you can use `@category` tag in your code:

```
/**
 * Class description
 * @category Category
 */
class YourClass {
  ....
}
```


## Customization

First of all, let me state that better-docs extends `default` template. That is why default template parameters are also handled.

To customize the better-docs pass `options` to `templates['better-docs']`. section in your `jsdoc confuguration file`.

Example configuration file with settings for both `default` and `better-docs` templates:

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
            "navigation": [
                {
                    "label": "Github",
                    "href": "https://github.com/SoftwareBrothers/admin-bro"
                },
                {
                    "label": "Example Application",
                    "href": "https://admin-bro-example-app.herokuapp.com/admin"
                }
            ]
        }
    }
}
```

## Setting up for the development

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

3. Within the better-docs folder run the gulp script. It will regenerate documentation everytime you change something.

It supports following EVN variables:

* `DOCS_COMMAND` - a command in your root repo which you use to generate documentation: i.e. `DOCS_COMMAND='jsdoc -c jsdoc.json'` or `npm run docs` if you have `docs` command defined in `package.json` file
* `DOCS_OUTPUT` - where your documentation is generated. It should point to the same folder your jsdoc `--destination` conf. But make sure that it is relative to the path where you cloned `better-docs`.
* `DOCS` - list of folders from your original repo what you want to watch for changes. Separated by comma.

```
cd better-docs
DOCS_COMMAND='npm run docs' DOCS=../src/**/*,../config/**/* DOCS_OUTPUT=../docs cd better-docs && gulp
```

Script should launch the browser and refresh it whenever you change something in the template or in `DOCS`.

## Setting up the jsdoc in your project

If you want to see how to setup jsdoc in your project - take a look at this short tutorial: https://www.youtube.com/watch?v=Yl6WARA3IhQ

## License

better-docs is Copyright © 2019 SoftwareBrothers.co. It is free software and may be redistributed under the terms specified in the [LICENSE](LICENSE) file.

## About SoftwareBrothers.co

<img src="https://softwarebrothers.co/assets/images/software-brothers-logo-full.svg" width=240>


We’re an open, friendly team that helps clients from all over the world to transform their businesses and create astonishing products.

* We are available to [hire](https://softwarebrothers.co/contact).
* If you want to work for us - check out the [career page](https://softwarebrothers.co/career).
