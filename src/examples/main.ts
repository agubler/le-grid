import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import uuid from '@dojo/core/uuid';
import CustomCell from './CustomCell';

import LeGrid from './../LeGrid';
import ArrayDataProvider from './../providers/ArrayDataProvider';
import StoreDataProvider from './../providers/StoreDataProvider';

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

let storeData = createData(200);
let arrayData = createData(200);

const arrayDataProvider = new ArrayDataProvider(arrayData);
const storeDataProvider = new StoreDataProvider(storeData);
const arrayDataProviderPaginated = new ArrayDataProvider(createData(500));
const storeDataProviderPaginated = new StoreDataProvider(createData(500));

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

const root = document.getElementsByTagName('store-data-grid')[0];

class Button extends ProjectorMixin(WidgetBase)<any> {
	render() {
		return v('button', { innerHTML: 'Use custom cell', classes: { button: true }, onclick: buttonClick(this.properties.dataProvider, this.properties.grid) } );
	}
}

const paginatedStoreGrid = new (ProjectorMixin(LeGrid));
paginatedStoreGrid.setProperties({
	dataProvider: storeDataProviderPaginated,
	pagination: {
		itemsPerPage: 10
	},
	columns
});

const storeGrid = new (ProjectorMixin(LeGrid));
storeGrid.setProperties({
	dataProvider: storeDataProvider,
	columns
});

const storeButton = new Button();
storeButton.setProperties({ dataProvider: storeDataProvider, grid: storeGrid });

storeButton.append(root);
storeGrid.append(root);
paginatedStoreGrid.append(root);

const arrayGridRoot = document.getElementsByTagName('array-data-grid')[0];

const paginatedArrayGrid = new (ProjectorMixin(LeGrid));
paginatedArrayGrid.setProperties({
	dataProvider: arrayDataProviderPaginated,
	pagination: {
		itemsPerPage: 10
	},
	columns
});

const arrayGrid = new (ProjectorMixin(LeGrid));
arrayGrid.setProperties({
	dataProvider: arrayDataProvider,
	columns
});

const arrayButton = new Button();
arrayButton.setProperties({ root: arrayGridRoot, dataProvider: arrayDataProvider, grid: arrayGrid });

arrayButton.append(arrayGridRoot);
arrayGrid.append(arrayGridRoot);
paginatedArrayGrid.append(arrayGridRoot);

function buttonClick(provider: any, grid: any) {
	let cellToggle = true;
	return function onclick() {
		const props = {
			dataProvider: provider,
			columns,
			customCell: cellToggle ? () => { return CustomCell; } : false
		};
		cellToggle = !cellToggle;
		grid.setProperties(props);
	};
}

setInterval(function() {
	const record = arrayData[Math.floor(Math.random() * arrayData.length + 1)];
	if (record) {
		const id = record.id;
		arrayDataProvider.patch({ id, location: locations[Math.floor(Math.random() * locations.length)], color: 'aqua' });
		setTimeout(() => {
			arrayDataProvider.patch({ id, color: 'transparent' });
		}, 500);
	}
}, 50);

setInterval(function() {
	const record = storeData[Math.floor(Math.random() * storeData.length + 1)];
	if (record) {
		const id = record.id;
		storeDataProvider.patch({ id, location: locations[Math.floor(Math.random() * locations.length)], color: 'aqua' });
		setTimeout(() => {
			storeDataProvider.patch({ id, color: 'transparent' });
		}, 500);
	}
}, 50);

const interval = setInterval(function() {
	const newData = createData(20);
	storeData = [...storeData, ...newData];
	storeDataProvider.put(newData);
	if (storeData.length > 500) {
		clearInterval(interval);
	}
}, 2000);

const arrayInterval = setInterval(function() {
	const newData = createData(20);
	arrayData = [...arrayData, ...newData];
	arrayDataProvider.put(newData);
	if (arrayData.length > 500) {
		clearInterval(arrayInterval);
	}
}, 2000);
