import { createQueryStore } from '@dojo/stores/store/mixins/createQueryTransformMixin';
import createProjectorMixin from '@dojo/widgets/mixins/createProjectorMixin';
import createWidgetBase from '@dojo/widgets/createWidgetBase';
import uuid from '@dojo/core/uuid';
import createCustomCell from './createCustomCell';

import createDgrid from './createDgrid';

const locations = [
	'Dive Bar',
	'Playground',
	'Early Bird Supper',
	'On the Lam',
	'Lost',
	'070-mark-63'
];

const secondLocations = [
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

const externalState = createQueryStore({
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

const properties = {
	externalState,
	pagination: {
		itemsPerPage: 25
	},
	columns
};

const paginatedGrid = createDgrid.mixin(createProjectorMixin)({ properties });

const dgrid = createDgrid.mixin(createProjectorMixin)({
	properties: {
		externalState,
		columns
	}
});

let cellToggle = true;

function onclick() {
	(<any> properties).customCell = cellToggle ? createCustomCell : false;
	cellToggle = !cellToggle;
	paginatedGrid.setProperties(properties);
}

const button = createWidgetBase.mixin(createProjectorMixin).override({
	tagName: 'button',
	nodeAttributes: [
		function(): any {
			return { innerHTML: 'Click Me', style: 'background-color: red; height: 30px; width: 100%', onclick };
		}
	]
})();

button.append();
paginatedGrid.append();
dgrid.append();

setInterval(function() {
	const id = data[Math.floor(Math.random() * data.length + 1)].id;
	externalState.patch({ id, location: secondLocations[Math.floor(Math.random() * secondLocations.length)], color: 'aqua' });
	setTimeout(() => {
		externalState.patch({ id, color: 'transparent' });
	}, 250);
}, 500);

const interval = setInterval(function() {
	const newData = createData(20);
	data = [...data, ...newData];
	externalState.put(newData);
	if (data.length > 500) {
		clearInterval(interval);
	}
}, 2000);
