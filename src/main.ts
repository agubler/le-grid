import createObservableStoreMixin, { createObservableStore } from '@dojo/stores/store/mixins/createObservableStoreMixin';
import createQueryStoreMixin, { createQueryStore } from '@dojo/stores/store/mixins/createQueryTransformMixin';
import createProjectorMixin from '@dojo/widgets/mixins/createProjectorMixin';
import FactoryRegistry from '@dojo/widgets/FactoryRegistry';

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
}

const externalState = createQueryStore({
	data: createData(15)
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
