import { createQueryStore } from '@dojo/stores/store/mixins/createQueryTransformMixin';
import createProjectorMixin from '@dojo/widgets/mixins/createProjectorMixin';
import createWidgetBase from '@dojo/widgets/createWidgetBase';
import uuid from '@dojo/core/uuid';

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

let data = createData(55);

const externalState = createQueryStore({
	data: [...data]
});

const columns = [
	{
		id: 'age',
		field: 'age',
		label: 'Age',
		sortable: true
	},
	{
		id: 'gender',
		field: 'gender',
		label: 'Gender',
		sortable: true
	},
	{
		id: 'location',
		field: 'location',
		label: 'Location'
	},
	{
		id: 'delete',
		field: '',
		label: ''
	}
];

const dgrid = createDgrid.mixin(createProjectorMixin)({
	properties: {
		externalState,
		pagination: {
			itemsPerPage: 25
		},
		columns
	}
});

const paginatedGrid = createDgrid.mixin(createProjectorMixin)({
	properties: {
		externalState,
		columns
	}
});

function onclick() {
	const id = String(Math.floor(Math.random() * data.length + 1));
	externalState.patch({ id, location: secondLocations[Math.floor(Math.random() * secondLocations.length)] });
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
dgrid.append();
paginatedGrid.append();

setInterval(function() {
	const id = data[Math.floor(Math.random() * data.length + 1)].id;
	externalState.patch({ id, location: secondLocations[Math.floor(Math.random() * secondLocations.length)], color: 'aqua' });
	setTimeout(() => {
		externalState.patch({ id, color: 'transparent' });
	}, 250);
}, 500);

setInterval(function() {
	const newData = createData(20);
	data = [...data, ...newData];
	externalState.put(newData);
}, 2000);
