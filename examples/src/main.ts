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
		title: 'First Name',
		sortable: true,
		filterable: true
	},
	{
		id: 'lastName',
		title: 'Last Name',
		sortable: true,
		filterable: true
	}
];

const store = new Store();
const data = createData(20000);

async function fetcher(page: number, pageSize: number, options?: any) {
	let copiedData = [...data];
	const { sort, filter } = options;
	if (Object.keys(filter).length > 0) {
		copiedData = copiedData.filter((item) => {
			return item[filter.columnId].indexOf(filter.value) > -1;
		});
	}

	if (Object.keys(sort).length > 0) {
		copiedData.sort((a, b) => {
			const left = sort.direction === 'asc' ? a : b;
			const right = sort.direction === 'asc' ? b : a;
			if (left[sort.columnId] < right[sort.columnId]) {
				return 1;
			}
			if (left[sort.columnId] > right[sort.columnId]) {
				return -1;
			}
			return 0;
		});
	}

	const block = [...copiedData].splice((page - 1) * pageSize, pageSize);
	const promise = new Promise<FetcherResult>((resolve) => {
		setTimeout(() => {
			resolve({ data: block, meta: { total: copiedData.length } } as any);
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
