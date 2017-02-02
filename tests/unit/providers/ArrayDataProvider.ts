import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import ArrayDataProvider from './../../../src/providers/ArrayDataProvider';

registerSuite({
	name: 'mixins/ArrayDataProvider',
	beforeEach() {
	},
	'intialised with data'() {
		const dataProvider = new ArrayDataProvider([ { id: 'id' }, { id: 'id1' }]);
		const promise = new Promise((resolve, reject) => {
			dataProvider.observe().subscribe((data) => {
				try {
					assert.deepEqual(data.items[0].toJS(), { id: 'id' });
					resolve();
				}
				catch (err) {
					reject(err);
				}
			});
		});
		return promise;
	},
	'fetch triggers observe subscriptions'() {
		const dataProvider = new ArrayDataProvider([ { id: 'id' }, { id: 'id1' }]);
		let observeCount = 0;
		const promise = new Promise((resolve, reject) => {
			dataProvider.observe().subscribe((data) => {
				try {
					if (observeCount === 0) {
						assert.lengthOf(data.items, 2);
						assert.deepEqual(data.items[0].toJS(), { id: 'id' });
						assert.deepEqual(data.totalCount, 2);
						assert.deepEqual(data.state, {});
					}
					else if (observeCount === 1) {
						assert.lengthOf(data.items, 1);
						assert.deepEqual(data.items[0].toJS(), { id: 'id1' });
						assert.deepEqual(data.state, { size: { start: 1, count: 1 } });
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
		dataProvider.fetch({ start: 1, count: 1});
		return promise;
	},
	'sort request'() {
		const dataProvider = new ArrayDataProvider([
			{ id: 'a' },
			{ id: 'a' },
			{ id: 'z' },
			{ id: 'g' }
		]);
		let observeCount = 0;
		const promise = new Promise((resolve, reject) => {
			dataProvider.observe().subscribe((data) => {
				try {
					if (observeCount === 1) {
						assert.lengthOf(data.items, 4);
						assert.deepEqual(data.items[0].toJS(), { id: 'z' });
						assert.deepEqual(data.items[3].toJS(), { id: 'a' });
						assert.deepEqual(data.state, { sort: { columnId: 'id', direction: 'desc'} });
						assert.deepEqual(data.totalCount, 4);
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
		return promise;
	},
	patch: {
		'patch a single new item'() {
			const dataProvider = new ArrayDataProvider([ { id: 'a' }, { id: 'z' }]);
			let observeCount = 0;
			const promise = new Promise((resolve, reject) => {
				dataProvider.observe().subscribe((data) => {
					try {
						if (observeCount === 1) {
							assert.lengthOf(data.items, 3);
							assert.deepEqual(data.items[2].toJS(), { id: 'x' });
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
			dataProvider.patch({ id: 'x' });
			return promise;
		},
		'patch a single existing item'() {
			const dataProvider = new ArrayDataProvider([ { id: 'a' }, { id: 'z', value: 'foo' }]);
			let observeCount = 0;
			const promise = new Promise((resolve, reject) => {
				dataProvider.observe().subscribe((data) => {
					try {
						if (observeCount === 0) {
							assert.deepEqual(data.items[1].toJS(), { id: 'z', value: 'foo' });
						}
						if (observeCount === 1) {
							assert.deepEqual(data.items[1].toJS(), { id: 'z', value: 'bar' });
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
			const dataProvider = new ArrayDataProvider([ { id: 'a' }, { id: 'z', value: 'foo' }]);
			let observeCount = 0;
			const promise = new Promise((resolve, reject) => {
				dataProvider.observe().subscribe((data) => {
					try {
						if (observeCount === 0) {
							assert.lengthOf(data.items, 2);
							assert.deepEqual(data.items[1].toJS(), { id: 'z', value: 'foo' });
						}
						if (observeCount === 1) {
							assert.lengthOf(data.items, 3);
							assert.deepEqual(data.items[1].toJS(), { id: 'z', value: 'bar' });
							assert.deepEqual(data.items[2].toJS(), { id: 'x' });
							resolve();
						}
						observeCount++;
					}
					catch (err) {
						reject(err);
					}
				});
			});
			dataProvider.patch([{ id: 'z', value: 'bar' }, { id: 'x' }]);
			return promise;
		}
	},
	put: {
		'put a single new item'() {
			const dataProvider = new ArrayDataProvider([ { id: 'a' }, { id: 'z' }]);
			let observeCount = 0;
			const promise = new Promise((resolve, reject) => {
				dataProvider.observe().subscribe((data) => {
					try {
						if (observeCount === 1) {
							assert.lengthOf(data.items, 3);
							assert.deepEqual(data.items[2].toJS(), { id: 'x' });
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
		'put a single existing item'() {
			const dataProvider = new ArrayDataProvider([ { id: 'a' }, { id: 'z', value: 'foo' }]);
			let observeCount = 0;
			const promise = new Promise((resolve, reject) => {
				dataProvider.observe().subscribe((data) => {
					try {
						if (observeCount === 0) {
							assert.deepEqual(data.items[1].toJS(), { id: 'z', value: 'foo' });
						}
						if (observeCount === 1) {
							assert.deepEqual(data.items[1].toJS(), { id: 'z', value: 'bar' });
							resolve();
						}
						observeCount++;
					}
					catch (err) {
						reject(err);
					}
				});
			});
			dataProvider.put({ id: 'z', value: 'bar' });
			return promise;
		},
		'put a multiple items'() {
			const dataProvider = new ArrayDataProvider([ { id: 'a' }, { id: 'z', value: 'foo' }]);
			let observeCount = 0;
			const promise = new Promise((resolve, reject) => {
				dataProvider.observe().subscribe((data) => {
					try {
						if (observeCount === 0) {
							assert.lengthOf(data.items, 2);
							assert.deepEqual(data.items[1].toJS(), { id: 'z', value: 'foo' });
						}
						if (observeCount === 1) {
							assert.lengthOf(data.items, 3);
							assert.deepEqual(data.items[1].toJS(), { id: 'z', value: 'bar' });
							assert.deepEqual(data.items[2].toJS(), { id: 'x' });
							resolve();
						}
						observeCount++;
					}
					catch (err) {
						reject(err);
					}
				});
			});
			dataProvider.put([{ id: 'z', value: 'bar' }, { id: 'x' }]);
			return promise;
		}
	},
	configure: {
		'configure both fetch and sort triggers observers'() {
			const dataProvider = new ArrayDataProvider([ { id: 'a' }, { id: 'z' }]);
			let observeCount = 0;
			const promise = new Promise((resolve, reject) => {
				dataProvider.observe().subscribe((data) => {
					try {
						if (observeCount === 1) {
							assert.lengthOf(data.items, 1);
							assert.deepEqual(data.items[0].toJS(), { id: 'z' });
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
			const dataProvider = new ArrayDataProvider([ { id: 'a' }, { id: 'z' }]);
			let observeCount = 0;
			const promise = new Promise((resolve, reject) => {
				dataProvider.observe().subscribe((data) => {
					try {
						if (observeCount === 1) {
							assert.lengthOf(data.items, 1);
							assert.deepEqual(data.items[0].toJS(), { id: 'a' });
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
			const dataProvider = new ArrayDataProvider([ { id: 'a' }, { id: 'z' }]);
			let observeCount = 0;
			const promise = new Promise((resolve, reject) => {
				dataProvider.observe().subscribe((data) => {
					try {
						if (observeCount === 1) {
							assert.lengthOf(data.items, 2);
							assert.deepEqual(data.items[0].toJS(), { id: 'z' });
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
