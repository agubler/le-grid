import createProjectorMixin from '@dojo/widget-core/mixins/createProjectorMixin';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import uuid from '@dojo/core/uuid';
import createCustomCell from './createCustomCell';

import createGrid from './../createGrid';
import ArrayDataProvider from './../providers/ArrayDataProvider';

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

let data = createData(500);

const dataProvider1 = new ArrayDataProvider(data);
const dataProvider2 = new ArrayDataProvider(data);

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

const paginatedGrid = createGrid.mixin(createProjectorMixin)({
	properties: {
		dataProvider: dataProvider1,
		pagination: {
			itemsPerPage: 25
		},
		columns
	}
});

const grid = createGrid.mixin(createProjectorMixin)({
	properties: {
		dataProvider: dataProvider2,
		columns
	}
});

let cellToggle = true;

function onclick() {
	const props = {
		dataProvider: dataProvider2,
		columns,
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
paginatedGrid.append();

setInterval(function() {
	const record = data[Math.floor(Math.random() * data.length + 1)];
	if (record) {
		const id = record.id;
		dataProvider1.patch({ id, location: locations[Math.floor(Math.random() * locations.length)], color: 'aqua' });
		setTimeout(() => {
			dataProvider1.patch({ id, color: 'transparent' });
		}, 500);
	}
}, 50);

/*const interval = setInterval(function() {
	const newData = createData(20);
	data = [...data, ...newData];
	dataProvider.patch(newData);
	if (data.length > 500) {
		clearInterval(interval);
	}
}, 2000);*/
