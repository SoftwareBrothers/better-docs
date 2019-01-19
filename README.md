# BetterDocs

Beautiful and simple documentation template for JSDoc 3.

<img src="./readme/class.png" />
<img src="./readme/with-mermaid.png" />

## Installation

```sh
npm install --save-dev better-docs
```

## Usage

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

"opts": {
  "template": "node_modules/better-docs"
}

## Customization

First of all, let me remind you that better-docs extends `default` template. That is why default template parameters are also handled.

To customize the better-docs pass `options` to `templates['better-docs']`. section in your `jsdoc confuguration file`.

Example configuration file with settings for both `default` and `better-docs` templates:

```json
{
    "tags": {
        "allowUnknownTags": ["mermaid"]
    },
    "source": {
        "include": ["./admin-bro/src"],
        "includePattern": ".js$",
        "excludePattern": "(node_modules/|docs)"
    },
    "plugins": [
        "plugins/markdown",
        "jsdoc-mermaid"
    ],
    "opts": {
        "encoding": "utf8",
        "destination": "docs/",
        "readme": "./docs-src/home.md",
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

If you want to change the theam locally follow the steps:

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
npm install

# or

yarn
```

3. Within the better-docs folder run the gulp script. It will regenerate documentation everytime you change something.

```
cd better-docs
DOCS_COMMAND='npm run docs' DOCS_OUTPUT='../docs' cd better-docs && gulp
```

## License

BetterDocs is Copyright © 2019 SoftwareBrothers.co. It is free software and may be redistributed under the terms specified in the [LICENSE](LICENSE) file.

## About SoftwareBrothers.co

<img src="https://softwarebrothers.co/assets/images/software-brothers-logo-full.svg" width=240>


We’re an open, friendly team that helps clients from all over the world to transform their businesses and create astonishing products.

* We are available to [hire](https://softwarebrothers.co/contact).
* If you want to work for us - check out the [career page](https://softwarebrothers.co/career).