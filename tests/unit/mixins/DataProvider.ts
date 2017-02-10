import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { DataProviderMixin } from '../../../src/mixins/DataProvider';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import ArrayDataProvider from './../../../src/providers/ArrayDataProvider';
import { DataProvider} from './../../../src/providers/interfaces';

let invalidateCalled = false;

class TestClass extends DataProviderMixin(WidgetBase)<any> {
	invalidate() {
		invalidateCalled = true;
		super.invalidate();
	}
}

let dataProvider: DataProvider<any, any>;

registerSuite({
	name: 'mixins/DataProvider',
	beforeEach() {
		invalidateCalled = false;
		dataProvider = new ArrayDataProvider<any>([{ id: 'id', foo: 'bar' }]);
	},
	getData() {
		const dataProviderTest = new TestClass({ dataProvider });
		assert.deepEqual(dataProviderTest.data.totalCount, 1);
		assert.deepEqual(dataProviderTest.data.state, {});
		assert.deepEqual(dataProviderTest.data.items[0].toJS(), { id: 'id', foo: 'bar' });
	},
	'no data provider'() {
		const dataProviderTest = new TestClass({});
		assert.deepEqual(dataProviderTest.data.totalCount, 0);
		assert.deepEqual(dataProviderTest.data.state, {});
		assert.deepEqual(dataProviderTest.data.items, []);
	}
});
