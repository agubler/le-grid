import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { Store } from '@dojo/stores/Store';
import { v } from '@dojo/widget-core/d';
import { ColumnConfig, FetcherResult } from 'le-grid/interfaces';
import Grid from 'le-grid';
import { createData } from './data';

const columnConfig: ColumnConfig[] = [
	{
		id: 'id',
		title: 'Id',
		renderer: (data) => {
			return v('div', { styles: { color: 'red' } }, [`${data.value}`]);
		}
	},
	{
		id: 'title',
		title: 'Title',
		renderer: (data) => {
			return v('span', [v('input', { type: 'checkbox' }), data.value]);
		}
	},
	{
		id: 'firstName',
		title: 'First Name'
	},
	{
		id: 'lastName',
		title: 'Last Name'
	}
];

const store = new Store();
const data = createData(2000);

async function fetcher(page: number, pageSize: number) {
	const block = [...data].splice((page - 1) * pageSize, pageSize);
	const promise = new Promise<FetcherResult>((resolve) => {
		setTimeout(() => {
			resolve({ data: block, meta: { total: data.length } } as any);
		}, 300);
	});
	return promise;
}

const Projector = ProjectorMixin(Grid);
const projector = new Projector();
projector.setProperties({
	columnConfig,
	fetcher,
	store,
	pageSize: 100
});
projector.append();
