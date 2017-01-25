import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import FactoryRegistry from '@dojo/widget-core/FactoryRegistry';
import { spy, stub, SinonSpy, SinonStub } from 'sinon';
import * as compose from '@dojo/compose/compose';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { createQueryStore } from '@dojo/stores/store/mixins/createQueryTransformMixin';

import createBody from '../../src/createBody';

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
		const store = createQueryStore({
				data: [
					{ id: 'id', foo: 'bar' }
				]
		});
		const properties = {
			registry: mockRegistry,
			store,
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const row = createBody({ properties });
		const promise = new Promise((resolve) => setTimeout(resolve, 10));

		return promise.then(() => {
			const vnode = <VNode> row.__render__();

			assert.strictEqual(vnode.vnodeSelector, 'div.grid-scroller');
			assert.lengthOf(vnode.children, 1);
			assert.equal(vnode.children![0].vnodeSelector, 'div.grid-content');
			assert.lengthOf(vnode.children![0].children, 1);
			assert.isTrue(widgetBaseSpy.calledOnce);
			const args = widgetBaseSpy.getCall(0).args[0];
			assert.deepEqual(args, { properties: {
				id: 'id',
				store,
				registry: mockRegistry,
				columns: properties.columns,
				item: { id: 'id', foo: 'bar' }
			}});
		});
	},
	'render with no items'() {
		const store = createQueryStore({
				data: undefined
		});
		const properties = {
			registry: mockRegistry,
			store,
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const row = createBody({ properties });
		const promise = new Promise((resolve) => setTimeout(resolve, 10));

		return promise.then(() => {
			const vnode = <VNode> row.__render__();

			assert.strictEqual(vnode.vnodeSelector, 'div.grid-scroller');
			assert.lengthOf(vnode.children, 1);
			assert.equal(vnode.children![0].vnodeSelector, 'div.grid-content');
			assert.lengthOf(vnode.children![0].children, 0);
			assert.isTrue(widgetBaseSpy.notCalled);
		});
	}
});
