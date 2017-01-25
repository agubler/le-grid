import { createQueryStore } from '@dojo/stores/store/mixins/createQueryTransformMixin';
import createProjectorMixin from '@dojo/widget-core/mixins/createProjectorMixin';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import uuid from '@dojo/core/uuid';
import createCustomCell from './../../src/examples/createCustomCell';

import createGrid from './../../src/createGrid';

const store = createQueryStore({
	data: [
		{ id: uuid(), age: 1, gender: 'A', location: 'Out' },
		{ id: uuid(), age: 1, gender: 'B', location: 'Out' },
		{ id: uuid(), age: 2, gender: 'C', location: 'Out' },
		{ id: uuid(), age: 3, gender: 'D', location: 'Out' },
		{ id: uuid(), age: 4, gender: 'E', location: 'Out' },
		{ id: uuid(), age: 5, gender: 'F', location: 'Out' },
		{ id: uuid(), age: 6, gender: 'G', location: 'Out' },
		{ id: uuid(), age: 7, gender: 'H', location: 'Out' },
		{ id: uuid(), age: 8, gender: 'I', location: 'Out' },
		{ id: uuid(), age: 9, gender: 'J', location: 'Out' },
		{ id: uuid(), age: 10, gender: 'K', location: 'Out' },
		{ id: uuid(), age: 11, gender: 'L', location: 'Out' },
		{ id: uuid(), age: 12, gender: 'M', location: 'Out' },
		{ id: uuid(), age: 13, gender: 'N', location: 'Out' },
		{ id: uuid(), age: 14, gender: 'O', location: 'Out' },
		{ id: uuid(), age: 15, gender: 'P', location: 'Out' },
		{ id: uuid(), age: 16, gender: 'Q', location: 'Out' },
		{ id: uuid(), age: 17, gender: 'R', location: 'Out' },
		{ id: uuid(), age: 18, gender: 'S', location: 'Out' },
		{ id: uuid(), age: 19, gender: 'T', location: 'Out' },
		{ id: uuid(), age: 20, gender: 'U', location: 'Out' },
		{ id: uuid(), age: 2, gender: 'V', location: 'Out' },
		{ id: uuid(), age: 3, gender: 'W', location: 'Out' },
		{ id: uuid(), age: 4, gender: 'X', location: 'Out' },
		{ id: uuid(), age: 5, gender: 'Y', location: 'Out' },
		{ id: uuid(), age: 6, gender: 'Z', location: 'Out' },
		{ id: uuid(), age: 7, gender: 'AA', location: 'Out' },
		{ id: uuid(), age: 8, gender: 'BB', location: 'Out' },
		{ id: uuid(), age: 9, gender: 'CC', location: 'Out' },
		{ id: uuid(), age: 10, gender: 'DD', location: 'Out' },
		{ id: uuid(), age: 11, gender: 'EE', location: 'Out' },
		{ id: uuid(), age: 12, gender: 'FF', location: 'Out' },
		{ id: uuid(), age: 13, gender: 'GG', location: 'Out' },
		{ id: uuid(), age: 14, gender: 'HH', location: 'Out' },
		{ id: uuid(), age: 15, gender: 'II', location: 'Out' },
		{ id: uuid(), age: 16, gender: 'JJ', location: 'Out' },
		{ id: uuid(), age: 17, gender: 'KK', location: 'Out' },
		{ id: uuid(), age: 18, gender: 'LL', location: 'Out' },
		{ id: uuid(), age: 19, gender: 'MM', location: 'Out' },
		{ id: uuid(), age: 20, gender: 'NN', location: 'Out' }
	]
});

const columns = [
	{
		id: 'age',
		field: 'age',
		label: 'Age',
		sortable: true,
		renderer: function (value: string) {
			return value + ' years old';
		}
	},
	{
		id: 'gender',
		field: 'gender',
		label: 'Gender',
		sortable: true,
		renderer: function (value: string) {
			return 'is a ' + value;
		}
	},
	{
		id: 'location',
		field: 'location',
		label: 'Location',
		renderer: function (value: string) {
			return 'located at ' + value;
		}
	},
	{
		id: 'delete',
		field: '',
		label: '',
		renderer: function (value: string) {
			return '🗑';
		}
	}
];

const grid = createGrid.mixin(createProjectorMixin)({
	properties: {
		store,
		pagination: {
			itemsPerPage: 5
		},
		columns
	}
});

let cellToggle = true;

function onclick() {
	const props = {
		store,
		columns,
		pagination: {
			itemsPerPage: 5
		},
		customCell: cellToggle ? createCustomCell : false
	};
	cellToggle = !cellToggle;
	grid.setProperties(props);
}

const button = createWidgetBase.mixin(createProjectorMixin).override({
	tagName: 'button',
	nodeAttributes: [
		function(): any {
			return { innerHTML: 'Use custom cell', classes: { button: true }, onclick };
		}
	]
})();

button.append();
grid.append();
