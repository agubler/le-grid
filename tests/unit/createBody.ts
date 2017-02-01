import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import FactoryRegistry from '@dojo/widget-core/FactoryRegistry';
import { spy, stub, SinonSpy, SinonStub } from 'sinon';
import * as compose from '@dojo/compose/compose';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';

import ArrayDataProvider from './../../src/providers/ArrayDataProvider';
import createBody from '../../src/createBody';
import css from '../../src/styles/gridBody';

let widgetBaseSpy: SinonSpy;
let getStub: SinonStub;
let isComposeFactoryStub: SinonStub;
let mockRegistry: FactoryRegistry;

registerSuite({
	name: 'createBody',
	beforeEach() {
		widgetBaseSpy = spy(createWidgetBase);
		getStub = stub().withArgs('grid-row').returns(widgetBaseSpy);
		isComposeFactoryStub = stub(compose, 'isComposeFactory').returns(true);
		mockRegistry = <any> {
			get: getStub,
			has() {
				return true;
			}
		};
	},
	afterEach() {
		isComposeFactoryStub.restore();
	},
	'render with items'() {
		const dataProvider = new ArrayDataProvider<any>([{ id: 'id', foo: 'bar' }]);
		const properties = {
			registry: mockRegistry,
			dataProvider,
			items: [{ id: 'id', foo: 'bar' }],
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const row = createBody({ properties });
		const promise = new Promise((resolve) => setTimeout(resolve, 10));

		return promise.then(() => {
			const vnode = <VNode> row.__render__();

			assert.strictEqual(vnode.vnodeSelector, 'div');
			assert.deepEqual(vnode.properties!.classes, { [css.classes.scroller]: true });
			assert.lengthOf(vnode.children, 1);
			assert.equal(vnode.children![0].vnodeSelector, 'div');
			assert.deepEqual(vnode.children![0].properties!.classes, { [css.classes.content]: true });
			assert.lengthOf(vnode.children![0].children, 1);
			assert.isTrue(widgetBaseSpy.calledOnce);
			const args = widgetBaseSpy.getCall(0).args[0];
			assert.deepEqual(args, { properties: {
				id: 'id',
				key: 'id',
				dataProvider,
				registry: mockRegistry,
				columns: properties.columns,
				item: { id: 'id', foo: 'bar' }
			}});
		});
	},
	'render with no items'() {
		const dataProvider = new ArrayDataProvider();

		const properties = {
			registry: mockRegistry,
			dataProvider,
			items: [],
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const row = createBody({ properties });
		const promise = new Promise((resolve) => setTimeout(resolve, 10));

		return promise.then(() => {
			const vnode = <VNode> row.__render__();

			assert.strictEqual(vnode.vnodeSelector, 'div');
			assert.deepEqual(vnode.properties!.classes, { [css.classes.scroller]: true });
			assert.lengthOf(vnode.children, 1);
			assert.equal(vnode.children![0].vnodeSelector, 'div');
			assert.deepEqual(vnode.children![0].properties!.classes, { [css.classes.content]: true });
			assert.lengthOf(vnode.children![0].children, 0);
			assert.isTrue(widgetBaseSpy.notCalled);
		});
	}
});
