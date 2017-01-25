import { createQueryStore } from '@dojo/stores/store/mixins/createQueryTransformMixin';
import createProjectorMixin from '@dojo/widget-core/mixins/createProjectorMixin';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import uuid from '@dojo/core/uuid';
import createCustomCell from './createCustomCell';

import createDgrid from './../createDgrid';

const locations = [
	'Dive Bar',
	'Playground',
	'Early Bird Supper',
	'On the Lam',
	'Lost',
	'070-mark-63',
	'Fun Fair',
	'Bus Stop',
	'Las Vegas',
	'New York, New York',
	'Farm',
	'Scotland'
];

function createData(count: number): any[] {
	const data: any[] = [];

	for (let i = 0; i < count; i++) {
		data.push({
			id: uuid(),
			age: Math.floor(Math.random() * 100) + 1,
			gender: String.fromCharCode(Math.floor(Math.random() * 25) + 65),
			location: locations[Math.floor(Math.random() * locations.length)],
			color: 'transparent'
		});
	}

	return data;
};

let data = createData(250);

const store = createQueryStore({
	data: [...data]
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

const paginatedGrid = createDgrid.mixin(createProjectorMixin)({
	properties: {
		store,
		pagination: {
			itemsPerPage: 25
		},
		columns
	}
});

const dgrid = createDgrid.mixin(createProjectorMixin)({
	properties: {
		store,
		columns
	}
});

let cellToggle = true;

function onclick() {
	const props = {
		store,
		columns,
		customCell: cellToggle ? createCustomCell : false
	};
	cellToggle = !cellToggle;
	dgrid.setProperties(props);
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
dgrid.append();
paginatedGrid.append();

setInterval(function() {
	const record = data[Math.floor(Math.random() * data.length + 1)];
	if (record) {
		const id = record.id;
		store.patch({ id, location: locations[Math.floor(Math.random() * locations.length)], color: 'aqua' });
		setTimeout(() => {
			store.patch({ id, color: 'transparent' });
		}, 500);
	}
}, 50);

const interval = setInterval(function() {
	const newData = createData(20);
	data = [...data, ...newData];
	store.put(newData);
	if (data.length > 500) {
		clearInterval(interval);
	}
}, 2000);
