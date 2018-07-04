import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
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
		filterable: false
	},
	{
		id: 'lastName',
		title: 'Last Name',
		sortable: true,
		editable: true,
		filterable: false
	}
];

const data = createData(200000);
const fetcher = createFetcher(data);
const updater = createUpdater(data);

class App extends WidgetBase {
	render() {
		return v('div', { styles: { height: '400px' } }, [w(Grid, { columnConfig, fetcher, updater })]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();
projector.append();
