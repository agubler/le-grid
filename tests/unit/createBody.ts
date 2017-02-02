import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import FactoryRegistry from '@dojo/widget-core/FactoryRegistry';
import { spy, stub, SinonSpy, SinonStub } from 'sinon';
import * as compose from '@dojo/compose/compose';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';

import { assertAppliedClasses } from './../support/classHelper';
import ArrayDataProvider from './../../src/providers/ArrayDataProvider';
import createBody from '../../src/createBody';
import * as css from '../../src/styles/gridBody.css';
import { Map as ImmutableMap } from 'immutable';

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
		/*const promise = new Promise((resolve) => setTimeout(resolve, 10));*/

		/*return promise.then(() => {*/
			const vnode = <VNode> row.__render__();

			assert.strictEqual(vnode.vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.scroller], vnode.properties!.classes));
			assert.lengthOf(vnode.children, 1);
			assert.equal(vnode.children![0].vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.content], vnode.children![0].properties!.classes));
			assert.lengthOf(vnode.children![0].children, 1);
			assert.isTrue(widgetBaseSpy.calledOnce);
			const args = widgetBaseSpy.getCall(0).args[0];

			assert.deepEqual(args.properties.key, 'id');
			assert.deepEqual(args.properties.id, 'id');
			assert.deepEqual(args.properties.item, { id: 'id', foo: 'bar' });
			assert.deepEqual(args.properties.registry, mockRegistry);
			assert.deepEqual(args.properties.dataProvider, dataProvider);
		/*});*/
	},
	'render with no items'() {
		const dataProvider = new ArrayDataProvider();

		const properties = {
			registry: mockRegistry,
			dataProvider,
			items: <any> undefined,
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const row = createBody({ properties });
		const promise = new Promise((resolve) => setTimeout(resolve, 10));

		return promise.then(() => {
			const vnode = <VNode> row.__render__();

			assert.strictEqual(vnode.vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.scroller], vnode.properties!.classes));
			assert.lengthOf(vnode.children, 1);
			assert.equal(vnode.children![0].vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.content], vnode.children![0].properties!.classes));
			assert.lengthOf(vnode.children![0].children, 0);
			assert.isTrue(widgetBaseSpy.notCalled);
		});
	},
	'render with immutable items'() {
		const dataProvider = new ArrayDataProvider();

		const item = ImmutableMap({ id: 'id', foo: 'bar' });
		const properties = {
			registry: mockRegistry,
			dataProvider,
			items: [item],
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const row = createBody({ properties });
		const promise = new Promise((resolve) => setTimeout(resolve, 10));

		return promise.then(() => {
			const vnode = <VNode> row.__render__();

			assert.strictEqual(vnode.vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.scroller], vnode.properties!.classes));
			assert.lengthOf(vnode.children, 1);
			assert.equal(vnode.children![0].vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.content], vnode.children![0].properties!.classes));
			assert.lengthOf(vnode.children![0].children, 1);
			const args = widgetBaseSpy.getCall(0).args[0];

			assert.deepEqual(args.properties.key, 'id');
			assert.deepEqual(args.properties.id, 'id');
			assert.deepEqual(args.properties.item, item);
			assert.deepEqual(args.properties.registry, mockRegistry);
			assert.deepEqual(args.properties.dataProvider, dataProvider);
		});
	}
});
