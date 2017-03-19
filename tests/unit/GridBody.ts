import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import FactoryRegistry from '@dojo/widget-core/FactoryRegistry';
import { spy, stub, SinonSpy, SinonStub } from 'sinon';
import WidgetBase from '@dojo/widget-core/WidgetBase';

import { assertAppliedClasses } from './../support/classHelper';
import ArrayDataProvider from './../../src/providers/ArrayDataProvider';
import GridBody from '../../src/GridBody';
import * as css from '../../src/styles/gridBody.css';
import { Map as ImmutableMap } from 'immutable';

let widgetBaseSpy: SinonSpy;
let getStub: SinonStub;
let mockRegistry: FactoryRegistry;

registerSuite({
	name: 'GridBody',
	beforeEach() {
		widgetBaseSpy = spy(WidgetBase.prototype, 'setProperties');
		getStub = stub().withArgs('grid-row').returns(WidgetBase);
		mockRegistry = <any> {
			get: getStub,
			has() {
				return true;
			}
		};
	},
	afterEach() {
		widgetBaseSpy.restore();
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

		const row = new GridBody();
		row.setProperties(properties);
		const vnode = <VNode> row.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div');
		assert.isTrue(assertAppliedClasses([css.scroller], vnode.properties!.classes));
		assert.lengthOf(vnode.children, 1);
		assert.equal(vnode.children![0].vnodeSelector, 'div');
		assert.isTrue(assertAppliedClasses([css.content], vnode.children![0].properties!.classes));
		assert.lengthOf(vnode.children![0].children, 1);
		assert.isTrue(widgetBaseSpy.calledTwice);
		const args = widgetBaseSpy.getCall(1).args[0];

		assert.deepEqual(args.key, 'id');
		assert.deepEqual(args.id, 'id');
		assert.deepEqual(args.item, { id: 'id', foo: 'bar' });
		assert.deepEqual(args.registry, mockRegistry);
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

		const row = new GridBody();
		row.setProperties(properties);
		const vnode = <VNode> row.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div');
		assert.isTrue(assertAppliedClasses([css.scroller], vnode.properties!.classes));
		assert.lengthOf(vnode.children, 1);
		assert.equal(vnode.children![0].vnodeSelector, 'div');
		assert.isTrue(assertAppliedClasses([css.content], vnode.children![0].properties!.classes));
		assert.lengthOf(vnode.children![0].children, 0);
		assert.isTrue(widgetBaseSpy.calledOnce);
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

		const row = new GridBody();
		row.setProperties(properties);
		const vnode = <VNode> row.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div');
		assert.isTrue(assertAppliedClasses([css.scroller], vnode.properties!.classes));
		assert.lengthOf(vnode.children, 1);
		assert.equal(vnode.children![0].vnodeSelector, 'div');
		assert.isTrue(assertAppliedClasses([css.content], vnode.children![0].properties!.classes));
		assert.lengthOf(vnode.children![0].children, 1);
		const args = widgetBaseSpy.getCall(1).args[0];

		assert.deepEqual(args.key, 'id');
		assert.deepEqual(args.id, 'id');
		assert.deepEqual(args.item, item);
		assert.deepEqual(args.registry, mockRegistry);
	}
});
