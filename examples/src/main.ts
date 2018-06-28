import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import Grid from 'le-grid';
import { createFetcher, createUpdater } from 'le-grid/utils';

import { createData } from './data';

const columnConfig = [
	{
		id: 'id',
		title: 'Id'
	},
	{
		id: 'title',
		title: 'Title'
	},
	{
		id: 'firstName',
		title: 'First Name',
		sortable: true,
		editable: true,
		filterable: true
	},
	{
		id: 'lastName',
		title: 'Last Name',
		sortable: true,
		editable: true,
		filterable: true
	}
];

const data = createData(200000);
const fetcher = createFetcher(data);
const updater = createUpdater(data);

const Projector = ProjectorMixin(Grid);
const projector = new Projector();
projector.setProperties({
	columnConfig,
	fetcher,
	updater
});
projector.append();
