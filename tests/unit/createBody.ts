import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import FactoryRegistry from '@dojo/widgets/FactoryRegistry';
import { spy, stub, SinonSpy, SinonStub } from 'sinon';
import * as compose from '@dojo/compose/compose';
import createWidgetBase from '@dojo/widgets/createWidgetBase';
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
		getStub = stub().withArgs('dgrid-row').returns(widgetBaseSpy);
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
		const externalState = createQueryStore({
				data: [
					{ id: 'id', foo: 'bar' }
				]
		});
		const properties = {
			registry: mockRegistry,
			externalState,
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const row = createBody({ properties });
		const promise = new Promise((resolve) => setTimeout(resolve, 10));

		return promise.then(() => {
			const vnode = <VNode> row.__render__();

			assert.strictEqual(vnode.vnodeSelector, 'div.dgrid-scroller');
			assert.lengthOf(vnode.children, 1);
			assert.equal(vnode.children![0].vnodeSelector, 'div.dgrid-content');
			assert.lengthOf(vnode.children![0].children, 1);
			assert.isTrue(widgetBaseSpy.calledOnce);
			const args = widgetBaseSpy.getCall(0).args[0];
			assert.deepEqual(args, { properties: {
				id: 'id',
				externalState,
				registry: mockRegistry,
				columns: properties.columns,
				item: { id: 'id', foo: 'bar' }
			}});
		});
	},
	'render with no items'() {
		const externalState = createQueryStore({
				data: []
		});
		const properties = {
			registry: mockRegistry,
			externalState,
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const row = createBody({ properties });
		const promise = new Promise((resolve) => setTimeout(resolve, 10));

		return promise.then(() => {
			const vnode = <VNode> row.__render__();

			assert.strictEqual(vnode.vnodeSelector, 'div.dgrid-scroller');
			assert.lengthOf(vnode.children, 1);
			assert.equal(vnode.children![0].vnodeSelector, 'div.dgrid-content');
			assert.lengthOf(vnode.children![0].children, 0);
			assert.isTrue(widgetBaseSpy.notCalled);
		});
	}
});
