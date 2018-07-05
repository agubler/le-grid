const { describe, it, beforeEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

import { pageChangeProcess, fetcherProcess } from './../../src/processes';
import { Store } from '@dojo/stores/Store';
import { stub } from 'sinon';
import { OperationType } from '@dojo/stores/state/Patch';
import { Pointer } from '@dojo/stores/state/Pointer';

let store: Store;

describe('Grid Processes', () => {
	beforeEach(() => {
		store = new Store();
	});

	describe('Page Change Process', () => {
		it('should change the page', () => {
			pageChangeProcess(store)({ id: 'grid', page: 2 });
			const page = store.get(store.path('grid', 'meta', 'page'));
			assert.strictEqual(page, 2);
		});

		it('Should not fail if the page is already set', () => {
			pageChangeProcess(store)({ id: 'grid', page: 2 });
			let page = store.get(store.path('grid', 'meta', 'page'));
			assert.strictEqual(page, 2);
			pageChangeProcess(store)({ id: 'grid', page: 2 });
			page = store.get(store.path('grid', 'meta', 'page'));
			assert.strictEqual(page, 2);
		});
	});

	describe('Fetcher Process', () => {
		it('fetcher should update the page and meta data for request', async () => {
			const fetcherStub = stub();
			fetcherStub.returns({
				data: [{ id: '1' }],
				meta: {
					total: 10000
				}
			});
			await fetcherProcess(store)({ id: 'grid', page: 2, fetcher: fetcherStub, pageSize: 100 });
			const pages = store.get(store.path('grid', 'data'));
			assert.deepEqual(pages, { pages: { 'page-2': [{ id: '1' }] } });
			const meta = store.get(store.path('grid', 'meta'));
			assert.deepEqual(meta, { fetchedPages: [2], total: 10000, pageSize: 100 });
		});

		it('Should throw an error if the page has already been fetched', async () => {
			const fetcherStub = stub();
			fetcherStub.returns({
				data: [{ id: '1' }],
				meta: {
					total: 10000
				}
			});
			await fetcherProcess(store)({ id: 'grid', page: 2, fetcher: fetcherStub, pageSize: 100 });
			const pages = store.get(store.path('grid', 'data'));
			assert.deepEqual(pages, { pages: { 'page-2': [{ id: '1' }] } });
			const meta = store.get(store.path('grid', 'meta'));
			assert.deepEqual(meta, { fetchedPages: [2], total: 10000, pageSize: 100 });
			return fetcherProcess(store)({ id: 'grid', page: 2, fetcher: fetcherStub, pageSize: 100 }).then(
				(result) => {
					assert.isOk(result.error);
					assert.strictEqual((result as any).error.error.message, 'The page has already been requested');
				}
			);
		});

		it('Should throw an error if the grid is sorting', async () => {
			const fetcherStub = stub();
			store.apply([{ op: OperationType.REPLACE, path: new Pointer(['grid', 'meta', 'isSorting']), value: true }]);
			return fetcherProcess(store)({ id: 'grid', page: 2, fetcher: fetcherStub, pageSize: 100 }).then(
				(result) => {
					assert.isOk(result.error);
					assert.strictEqual((result as any).error.error.message, 'The grid is being sorted or filtered');
				}
			);
		});
	});
});
