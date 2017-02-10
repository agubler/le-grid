import compose from '@dojo/compose/compose';
import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import dataProviderMixin from '../../../src/mixins/dataProviderMixin';
import ArrayDataProvider from './../../../src/providers/ArrayDataProvider';
import { DataProvider } from './../../../src/providers/interfaces';

let invalidateCalled = false;
const dataProviderTestMixin = compose({
	invalidate() {
		invalidateCalled = true;
	},
	properties: <any> {}
}, (instance, options: any) => {
	if (options) {
		instance.properties = options.properties;
	}
}).mixin(dataProviderMixin);

let dataProvider: DataProvider<any, any>;

registerSuite({
	name: 'mixins/dataProviderMixin',
	beforeEach() {
		invalidateCalled = false;
		dataProvider = new ArrayDataProvider<any>([{ id: 'id', foo: 'bar' }]);
	},
	getData() {
		const dataProviderTest = dataProviderTestMixin({ properties: { dataProvider } });
		assert.deepEqual(dataProviderTest.data.totalCount, 1);
		assert.deepEqual(dataProviderTest.data.state, {});
		assert.deepEqual(dataProviderTest.data.items[0].toJS(), { id: 'id', foo: 'bar' });
	},
	'no data provider'() {
		const dataProviderTest = dataProviderTestMixin({ properties: {}});
		assert.isUndefined(dataProviderTest.data);
	}
});
