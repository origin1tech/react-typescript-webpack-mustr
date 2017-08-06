# React-Typescript-Webpack-Mustr

This seed helps you get up and running with the latest React, React-Router v4, Typescript and Webpack.
As an added bonus it includes Mustr which is a declarative scaffolding tool however it is not required
although is used to initially configure your project.

## Getting Started

First you will want to run the following:

```sh
$ node build configure
```

This will install the required dependencies and then run the configuration script setting up the project
with it's name, your github username, your repository, whether you want a Dockerfile configured and if
Google Analytics should be setup.

NOTE: you can reconfigure and existing project by running:

```sh
$ node build reconfigure
```

## Usage

At this point you'll largely be on your own if you don't wish to use the scafolding. If you do see
Mustr's README.md at: (https://github.com/origin1tech/mustr)[https://github.com/origin1tech/mustr].
However to give you a quick head start on that the basic templates for components are already setup
in the ./mustr directory.

To build a component simply run:

```sh
mu g component contact
```

This would create a contact component import it into your app.tsx and also inject the default reducers into
./shared/store.ts automatically!

Quick easy and painless. Of course you can always rollback using the last stored rollback by simply typing:

```sh
$ mu r
```

Feel free to modify any of the templates to your liking. Mustr templates are declarative. Open your template
use Mustache syntax with a small config and static/defaults using yaml (front-matter) and boom you've made or
edited a template. Once you get the hang of it adding new templates is very trivial.

## Tests

You can easily add you specs just type the following:

```sh
mu g spec path/to/name
```

To run tests nust call "npm test" as you usually would and boom everything tests. This seed by default will store all spec files based on the path of the project. Not the "test" folder. This is by design and why  you have two tsconfig.json files.

If you want you could even add specs automatically to any component by going into ./mustr/register.js and adding the spec template to the "component" registration.

## Wrap Up

This file will be renamed to "CONFIGURE.md" once you run npm run configure for reference as it will be replaced with your generated README.