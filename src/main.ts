import { createQueryStore } from '@dojo/stores/store/mixins/createQueryTransformMixin';
import createProjectorMixin from '@dojo/widgets/mixins/createProjectorMixin';
import FactoryRegistry from '@dojo/widgets/FactoryRegistry';
import createWidgetBase from '@dojo/widgets/createWidgetBase';

import createDgrid from './createDgrid';

const locations = [
	'Dive Bar',
	'Playground',
	'Early Bird Supper',
	'On the Lam',
	'Lost',
	'070-mark-63'
];

function createData(count: number): any[] {
	const data: any[] = [];

	for (let i = 0; i < count; i++) {
		data.push({
			id: String(i + 1),
			age: Math.floor(Math.random() * 100) + 1,
			gender: String.fromCharCode(Math.floor(Math.random() * 25) + 65),
			location: locations[Math.floor(Math.random() * locations.length)]
		});
	}

	return data;
};

const data = createData(3);

const externalState = createQueryStore({
	data
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
		registry: new FactoryRegistry(),
		columns
	}
});

dgrid.append().then(() => {
// 	setInterval(function() {
// 		externalState.patch({ id: '4', location: locations[Math.floor(Math.random() * locations.length)] });

// 	}, 1000);
});

function onclick() {
	const id = String(Math.floor(Math.random() * data.length + 1));
	// console.log(Math.floor(Math.random() * data.length + 1));
	// console.log(id);
	// externalState.patch({ id, location: locations[Math.floor(Math.random() * locations.length)] });
	externalState.patch({ id: '1', location: locations[Math.floor(Math.random() * locations.length)] });
	externalState.fetch().then((data) => {
		console.log('feth', data);
	});
}

const button = createWidgetBase.mixin(createProjectorMixin).override({
	tagName: 'button',
	nodeAttributes: [
		function(): any {
			return { innerHTML: 'Click Me', style: 'background-color: red; height: 100px; width: 100px', onclick };
		}
	]
})();

button.append();

dgrid.append().then(() => {
// 	setInterval(function() {
// 		externalState.patch({ id: '4', location: locations[Math.floor(Math.random() * locations.length)] });

// 	}, 1000);
});
