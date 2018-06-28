#![le grid](https://cdn.rawgit.com/agubler/le-grid/master/docs/legrid.png)

[![Build Status](https://travis-ci.org/agubler/le-grid.svg?branch=master)](https://travis-ci.org/agubler/le-grid)
[![codecov](https://codecov.io/gh/agubler/le-grid/branch/master/graph/badge.svg)](https://codecov.io/gh/agubler/le-grid)
[![npm version](https://badge.fury.io/js/le-grid.svg)](https://badge.fury.io/js/le-grid)

<img src="https://cdn.rawgit.com/agubler/le-grid/master/docs/Logo-01.svg" width=20%>

A reactive lightweight, customizable grid widget built with Dojo 2.

A running example can be seen [here](https://agubler.github.io/le-grid/).

### Installation

To use `le-grid`, install it from npm.

```shell
npm install le-grid --save
```

You can then import le-grid in your application as follows:

```ts
import LeGrid from 'le-grid';
```

### Features

 * On-demand virtual rendering with supports for large datasets
 * Backed by [`@dojo/stores`](https://github.com/dojo/stores)
 * Editable cells
 * Filtering and Sorting by column
 * Custom cell renderers

 An example of le-grid can be [found here](https://github.com/agubler/le-grid/blob/master/src/examples/main.ts)

### Usage

```ts
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { createFetcher } from 'le-grid/util';
import LeGrid from 'le-grid';

const columnConfig = [
	{
		id: 'one',
		title: 'Column One',
		sortable: true,
		filterable: true
	},
	{
		id: 'two',
		title: 'Column Two'
	}
];

const gridData: any[] = [
	{ one: '0', two: '0' },
	{ one: '1', two: '1' },
	{ one: '2', two: '2' },
	{ one: '3', two: '3' },
	{ one: '4', two: '4' },
	{ one: '5', two: '5' },
	{ one: '6', two: '6' }
];

const Projector = ProjectorMixin(LeGrid);
const projector = new Projector();
projector.setProperties({
	columnConfig,
	fetcher: createFetcher(gridData)
});
projector.append();
```

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
