#![le grid](https://cdn.rawgit.com/agubler/le-grid/master/docs/legrid.png)

[![Build Status](https://travis-ci.org/agubler/le-grid.svg?branch=master)](https://travis-ci.org/agubler/le-grid)
[![codecov](https://codecov.io/gh/agubler/le-grid/branch/master/graph/badge.svg)](https://codecov.io/gh/agubler/le-grid)
[![npm version](https://badge.fury.io/js/le-grid.svg)](https://badge.fury.io/js/le-grid)

<img src="https://cdn.rawgit.com/agubler/le-grid/master/docs/Logo-01.svg" width=20%>

A reactive lightweight, customisable grid implementation built using [@dojo/widget-core](https://github/dojo/widget-core) and [@dojo/stores](https://github/dojo/stores).

- [Features](#features)
- [Usage](#usage)
    - [Installation](#installation)
    - [Testing](#testing)

## Features

Supports cell customisation, configurable columns and pagination.

A running example can be seen [here](https://agubler.github.io/le-grid/).

<img src="https://cdn.rawgit.com/agubler/le-grid/master/docs/le-grid.gif">

### Installation

To use `le-grid`, install using `yarn` or `npm`

```shell
npm install le-grid --save
yarn add le-grid --save
```

### Usage

```ts
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import LeGrid from 'le-grid/LeGrid';
import ArrayDataProvider from 'le-grid/providers/ArrayDataProvider';

const dataProvider = new ArrayDataProvider([
	{ id: '1', value: 'one' }, 
	{ id: '2', value: 'two' }
]);

const columns = [{
	id: 'value',
	field: 'value',
   label: 'Value',
   sortable: true
}];

const Grid = ProjectorMixin(LeGrid);
const grid = new Grid();

grid.setProperties({
	dataProvider,
	columns
});

grid.append();
```

More usage examples can be [found here](https://github.com/agubler/le-grid/blob/master/src/examples/main.ts)

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
