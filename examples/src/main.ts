import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import Grid from 'le-grid';
import { createFetcher, createUpdater } from 'le-grid/utils';

import { createData } from './data';
import { FetcherOptions } from 'le-grid/interfaces';

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

const data = createData(20000);
const fetcher = createFetcher(data);
const updater = createUpdater(data);

const restfulFetcher = async (page: number, pageSize: number, options: FetcherOptions = {}) => {
	const offset = (page - 1) * pageSize;
	const response = await fetch(`https://mock-json-server.now.sh/data?offset=${offset}&size=${pageSize}`, {
		method: 'POST',
		body: JSON.stringify({
			sort: options.sort,
			filter: options.filter,
			offset,
			size: pageSize
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const json = await response.json();
	return { data: json.data, meta: { total: json.total } };
};

const restfulUpdater = async (item: any) => {
	await fetch(`https://mock-json-server.now.sh/data/${item.id}`, {
		method: 'POST',
		body: JSON.stringify(item),
		headers: {
			'Content-Type': 'application/json'
		}
	});
};

class App extends WidgetBase {
	render() {
		return v('div', { styles: { display: 'flex', justifyContent: 'space-around' } }, [
			v('div', { key: 'local', styles: { height: '400px' } }, [
				v('h1', ['Local Data']),
				w(Grid, { columnConfig, fetcher, updater })
			]),
			v('div', { key: 'rest', styles: { height: '400px' } }, [
				v('h1', ['RESTFUL API Data']),
				w(Grid, { columnConfig, fetcher: restfulFetcher, updater: restfulUpdater })
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();
projector.append();
