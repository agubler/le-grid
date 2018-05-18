import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import Grid from './Grid';
import { Store } from '@dojo/stores/Store';
import { v } from '@dojo/widget-core/d';
import { ColumnConfig, FetcherResult } from './interfaces';

const columnConfig: ColumnConfig[] = [
	{
		id: 'id',
		title: 'counter'
	},
	{
		id: 'uuid',
		title: 'uuid'
	},
	{
		id: 'other',
		title: () => v('span', { styles: { color: 'red' } }, ['red']),
		renderer: ({ value }) => {
			return v('div', { styles: { color: 'red' } }, [value]);
		}
	},
	{
		id: 'final',
		title: 'final',
		renderer: ({ value }) => {
			return v('div', [v('span', [value]), v('input', { type: 'checkbox' })]);
		}
	}
];

const store = new Store();

async function fetcher(page: number = 1, size: number = 150) {
	let data: any[] = [];
	let counter = 0;
	if (page > 2) {
		counter = (page - 2) * 50;
	}
	for (let i = 0; i < size; i++) {
		data.push({ id: `${counter++}`, uuid: 'a', other: 'hello', final: 'col' });
	}

	const promise = new Promise<FetcherResult>((resolve) => {
		setTimeout(() => {
			resolve({ data, meta: { total: 500000 } } as any);
		}, 200);
	});
	return promise;
}

async function updater() {
	console.log('consumer updater');
	// throw new Error('new');
}

const Projector = ProjectorMixin(Grid);
const projector = new Projector();
projector.setProperties({ columnConfig, fetcher, store, updater, rowHeight: 30, blockSize: 50 });
projector.append();
