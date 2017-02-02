import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import StoreDataProvider from './../../../src/providers/StoreDataProvider';
import { createQueryStore } from '@dojo/stores/store/mixins/createQueryTransformMixin';

registerSuite({
	name: 'mixins/StoreDataProvider',
	'intialised with no data'() {
		const dataProvider = new StoreDataProvider();
		const promise = new Promise((resolve, reject) => {
			dataProvider.observe().subscribe((data) => {
				try {
					assert.lengthOf(data.items, 0);
					assert.deepEqual(data.totalCount, 0);
					assert.deepEqual(data.state, {});
					resolve();
				}
				catch (err) {
					reject(err);
				}
			});
		});
		return promise;
	},
	'intialised with array data'() {
		const dataProvider = new StoreDataProvider([ { id: 'id' }, { id: 'id1' }]);
		let observeCount = 0;
		const promise = new Promise((resolve, reject) => {
			dataProvider.observe().subscribe((data) => {
				try {
					if (observeCount === 0) {
						assert.lengthOf(data.items, 0);
						assert.deepEqual(data.totalCount, 0);
						assert.deepEqual(data.state, {});
					}
					else {
						assert.lengthOf(data.items, 2);
						assert.deepEqual(data.items[0], { id: 'id' });
						assert.deepEqual(data.totalCount, 2);
						assert.deepEqual(data.state, {});
						resolve();
					}
					observeCount++;
				}
				catch (err) {
					reject(err);
				}
			});
		});
		return promise;
	},
	'intialised with store'() {
		const queryStore = createQueryStore({ data: [ { id: 'id' }, { id: 'id1' }]});
		const dataProvider = new StoreDataProvider(queryStore);
		let observeCount = 0;
		const promise = new Promise((resolve, reject) => {
			dataProvider.observe().subscribe((data) => {
				try {
					if (observeCount === 0) {
						assert.lengthOf(data.items, 0);
						assert.deepEqual(data.totalCount, 0);
						assert.deepEqual(data.state, {});
					}
					else {
						assert.lengthOf(data.items, 2);
						assert.deepEqual(data.items[0], { id: 'id' });
						assert.deepEqual(data.totalCount, 2);
						assert.deepEqual(data.state, {});
						resolve();
					}
					observeCount++;
				}
				catch (err) {
					reject(err);
				}
			});
		});
		return promise;
	},
	'fetch triggers observe subscriptions'() {
		const queryStore = createQueryStore({ data: [ { id: 'id' }, { id: 'id1' }]});
		const dataProvider = new StoreDataProvider(queryStore);
		let observeCount = 0;
		const promise = new Promise((resolve, reject) => {
			dataProvider.observe().subscribe((data) => {
				try {
					if (observeCount === 1) {
						assert.lengthOf(data.items, 0);
						assert.deepEqual(data.totalCount, 0);
					}
					else if (observeCount === 2) {
						assert.lengthOf(data.items, 1);
						assert.deepEqual(data.items[0], { id: 'id1' });
						assert.deepEqual(data.totalCount, 2);
						assert.deepEqual(data.state, { size: { start: 1, count: 1 } });
						resolve();
					}
					observeCount++;
				}
				catch (err) {
					reject(err);
				}
			});
		});
		dataProvider.fetch({ start: 1, count: 1});
		return promise;
	},
	'sort request'() {
		const queryStore = createQueryStore({ data: [ { id: 'a' }, { id: 'z' }]});
		const dataProvider = new StoreDataProvider(queryStore);
		let observeCount = 0;
		const promise = new Promise((resolve, reject) => {
			dataProvider.observe().subscribe((data) => {
				try {
					if (observeCount === 2) {
						assert.lengthOf(data.items, 2);
						assert.deepEqual(data.items, [{ id: 'z' }, { id: 'a' }]);
						assert.deepEqual(data.state, { sort: { columnId: 'id', direction: 'desc'} });
						assert.deepEqual(data.totalCount, 2);
					}
					if (observeCount === 3) {
						assert.lengthOf(data.items, 2);
						assert.deepEqual(data.items, [{ id: 'a' }, { id: 'z' }]);
						assert.deepEqual(data.state, { sort: { columnId: 'id', direction: 'asc'} });
						assert.deepEqual(data.totalCount, 2);
						resolve();
					}
					observeCount++;
				}
				catch (err) {
					reject(err);
				}
			});
		});
		dataProvider.sort({ columnId: 'id', direction: 'desc'});
		// hmmm probably need to figure out the ordering
		setTimeout(function() {
			dataProvider.sort({ columnId: 'id', direction: 'asc'});
		}, 100);
		return promise;
	},
	patch: {
		'patch a single existing item'() {
			const queryStore = createQueryStore({ data: [ { id: 'a' }, { id: 'z', value: 'foo' }]});
			const dataProvider = new StoreDataProvider(queryStore);
			let observeCount = 0;
			const promise = new Promise((resolve, reject) => {
				dataProvider.observe().subscribe((data) => {
					try {
						if (observeCount === 1) {
							assert.deepEqual(data.items[1], { id: 'z', value: 'foo' });
						}
						if (observeCount === 2) {
							assert.deepEqual(data.items[1], { id: 'z', value: 'bar' });
							resolve();
						}
						observeCount++;
					}
					catch (err) {
						reject(err);
					}
				});
			});
			dataProvider.patch({ id: 'z', value: 'bar' });
			return promise;
		},
		'patch a multiple items'() {
			const queryStore = createQueryStore({ data: [ { id: 'a' }, { id: 'z', value: 'foo' }]});
			const dataProvider = new StoreDataProvider(queryStore);
			let observeCount = 0;
			const promise = new Promise((resolve, reject) => {
				dataProvider.observe().subscribe((data) => {
					try {
						if (observeCount === 1) {
							assert.lengthOf(data.items, 2);
							assert.deepEqual(data.items[0], { id: 'a' });
							assert.deepEqual(data.items[1], { id: 'z', value: 'foo' });
						}
						if (observeCount === 2) {
							assert.lengthOf(data.items, 2);
							assert.deepEqual(data.items[0], { id: 'a', value: 'foo' });
							assert.deepEqual(data.items[1], { id: 'z', value: 'bar' });
							resolve();
						}
						observeCount++;
					}
					catch (err) {
						reject(err);
					}
				});
			});
			dataProvider.patch([{ id: 'z', value: 'bar' }, { id: 'a', value: 'foo' }]);
			return promise;
		}
	},
	put: {
		'put a single new item'() {
			const queryStore = createQueryStore({ data: [ { id: 'a' }, { id: 'z' }]});
			const dataProvider = new StoreDataProvider(queryStore);
			let observeCount = 0;
			const promise = new Promise((resolve, reject) => {
				dataProvider.observe().subscribe((data) => {
					try {
						if (observeCount === 2) {
							assert.lengthOf(data.items, 3);
							assert.deepEqual(data.items[2], { id: 'x' });
							assert.deepEqual(data.totalCount, 3);
							resolve();
						}
						observeCount++;
					}
					catch (err) {
						reject(err);
					}
				});
			});
			dataProvider.put({ id: 'x' });
			return promise;
		},
		'put a multiple items'() {
			const queryStore = createQueryStore({ data: [ { id: 'a' }, { id: 'z', value: 'foo' }]});
			const dataProvider = new StoreDataProvider(queryStore);
			let observeCount = 0;
			const promise = new Promise((resolve, reject) => {
				dataProvider.observe().subscribe((data) => {
					try {
						if (observeCount === 2) {
							assert.lengthOf(data.items, 4);
							assert.deepEqual(data.items[2], { id: 'd', value: 'bar' });
							assert.deepEqual(data.items[3], { id: 'x' });
							resolve();
						}
						observeCount++;
					}
					catch (err) {
						reject(err);
					}
				});
			});
			dataProvider.put([{ id: 'd', value: 'bar' }, { id: 'x' }]);
			return promise;
		}
	},
	configure: {
		'configure both fetch and sort triggers observers'() {
			const queryStore = createQueryStore({ data: [ { id: 'a' }, { id: 'z' }]});
			const dataProvider = new StoreDataProvider(queryStore);
			let observeCount = 0;
			const promise = new Promise((resolve, reject) => {
				dataProvider.observe().subscribe((data) => {
					try {
						if (observeCount === 2) {
							assert.lengthOf(data.items, 1);
							assert.deepEqual(data.items[0], { id: 'z' });
							assert.deepEqual(data.state, {
								sort: { columnId: 'id', direction: 'desc'},
								size: { start: 0, count: 1 }
							});
							assert.deepEqual(data.totalCount, 2);
							resolve();
						}
						observeCount++;
					}
					catch (err) {
						reject(err);
					}
				});
			});
			dataProvider.configure({
				sort: { columnId: 'id', direction: 'desc'},
				size: { start: 0, count: 1 }
			});
			return promise;
		},
		'configure only fetch triggers observers'() {
			const queryStore = createQueryStore({ data: [ { id: 'a' }, { id: 'z' }]});
			const dataProvider = new StoreDataProvider(queryStore);
			let observeCount = 0;
			const promise = new Promise((resolve, reject) => {
				dataProvider.observe().subscribe((data) => {
					try {
						if (observeCount === 2) {
							assert.lengthOf(data.items, 1);
							assert.deepEqual(data.items[0], { id: 'a' });
							assert.deepEqual(data.state, {
								size: { start: 0, count: 1 }
							});
							assert.deepEqual(data.totalCount, 2);
							resolve();
						}
						observeCount++;
					}
					catch (err) {
						reject(err);
					}
				});
			});
			dataProvider.configure({
				size: { start: 0, count: 1 }
			});
			return promise;
		},
		'configure only sort triggers observers'() {
			const queryStore = createQueryStore({ data: [ { id: 'a' }, { id: 'z' }]});
			const dataProvider = new StoreDataProvider(queryStore);
			let observeCount = 0;
			const promise = new Promise((resolve, reject) => {
				dataProvider.observe().subscribe((data) => {
					try {
						if (observeCount === 2) {
							assert.lengthOf(data.items, 2);
							assert.deepEqual(data.items[0], { id: 'z' });
							assert.deepEqual(data.state, {
								sort: { columnId: 'id', direction: 'desc'}
							});
							assert.deepEqual(data.totalCount, 2);
							resolve();
						}
						observeCount++;
					}
					catch (err) {
						reject(err);
					}
				});
			});
			dataProvider.configure({
				sort: { columnId: 'id', direction: 'desc'}
			});
			return promise;
		}
	}
});
