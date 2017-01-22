# le-grid

[![Build Status](https://travis-ci.org/agubler/le-grid.svg?branch=master)](https://travis-ci.org/agubler/le-grid)
[![codecov](https://codecov.io/gh/agubler/le-grid/branch/master/graph/badge.svg)](https://codecov.io/gh/agubler/le-grid)
[![npm version](https://badge.fury.io/js/le-grid.svg)](https://badge.fury.io/js/le-grid)

A reactive lightweight, customisable grid implementation built using [@dojo/widgets](https://github/dojo/widgets) and [@dojo/stores](https://github/dojo/stores).

- [Features](#features)
- [Usage](#usage)
    - [Installation](#installation)
    - [Testing](#testing)

## Features

Supports cell customisation, configurable columns and pagination.

## Usage

To use `le-grid`, clone the repository, install the dependencies, grunt link and npm link in the target project.

```shell
git clone git@github.com:agubler/le-grid.git

cd le-grid

npm install # or yarn install

grunt link # this uses npm link under the covers

cd path/to/project

npm link le-grid
```

### Installation

### Testing

Tests are written using Intern.

To test locally in node run:

```shell
grunt test
```

To test against browsers with a  selenium server run:

```ts
grunt test:local
```

To test against browserstack or saucelabs run:

```
grunt test:browserstack
```

```
grunt test:saucelabs
```
