import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import FactoryRegistry from '@dojo/widget-core/FactoryRegistry';
import { spy, stub, SinonSpy, SinonStub } from 'sinon';
import * as compose from '@dojo/compose/compose';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';

import { Map as ImmutableMap } from 'immutable';
import { assertAppliedClasses } from './../support/classHelper';
import ArrayDataProvider from './../../src/providers/ArrayDataProvider';
import createRow from '../../src/createRow';
import css from '../../src/styles/gridRow';

let widgetBaseSpy: SinonSpy;
let getStub: SinonStub;
let isComposeFactoryStub: SinonStub;
let mockRegistry: FactoryRegistry;

registerSuite({
	name: 'createRow',
	beforeEach() {
		widgetBaseSpy = spy(createWidgetBase);
		getStub = stub().withArgs('grid-cell').returns(widgetBaseSpy);
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
	render() {
		const renderer = (value: string) => { return value; };
		const properties = {
			registry: mockRegistry,
			id: 'id',
			dataProvider: new ArrayDataProvider<any>([{ id: 'id', foo: 'bar', bar: 'foo' }]),
			item: { id: 'id', foo: 'bar', bar: 'foo' },
			columns: [
				{ id: 'foo', label: 'foo' },
				{ id: 'bar', label: 'bar', renderer }
			]
		};

		const row = createRow({ properties });
		const vnode = <VNode> row.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div');
		assert.isTrue(assertAppliedClasses([css.classes.gridRow], vnode.properties!.classes));
		assert.strictEqual(vnode.properties!['role'], 'row');

		assert.lengthOf(vnode.children, 1);
		assert.strictEqual(vnode.children![0].vnodeSelector, 'table');
		assert.lengthOf(vnode.children![0].children, 1);
		assert.strictEqual(vnode.children![0].children![0].vnodeSelector, 'tr');
		assert.lengthOf(vnode.children![0].children![0].children, 2);
		assert.isTrue(widgetBaseSpy.calledTwice);

		const callOneArgs = widgetBaseSpy.getCall(0).args[0];
		assert.deepEqual(callOneArgs.properties.key, 'foo');
		assert.deepEqual(callOneArgs.properties.data, 'bar');
		assert.isUndefined(callOneArgs.properties.renderer);

		const callTwoArgs = widgetBaseSpy.getCall(1).args[0];
		assert.deepEqual(callTwoArgs.properties.key, 'bar');
		assert.deepEqual(callTwoArgs.properties.data, 'foo');
		assert.isFunction(callTwoArgs.properties.renderer);
	},
	'render with Immutable item'() {
		const properties = {
			registry: mockRegistry,
			id: 'id',
			dataProvider: new ArrayDataProvider<any>([{ id: 'id', foo: 'bar', bar: 'foo' }]),
			item: ImmutableMap({ id: 'id', foo: 'bar', bar: 'foo' }),
			columns: [
				{ id: 'foo', label: 'foo' },
				{ id: 'bar', label: 'bar' }
			]
		};

		const row = createRow({ properties });
		const vnode = <VNode> row.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div');
		assert.isTrue(assertAppliedClasses([css.classes.gridRow], vnode.properties!.classes));
		assert.strictEqual(vnode.properties!['role'], 'row');

		assert.lengthOf(vnode.children, 1);
		assert.strictEqual(vnode.children![0].vnodeSelector, 'table');
		assert.lengthOf(vnode.children![0].children, 1);
		assert.strictEqual(vnode.children![0].children![0].vnodeSelector, 'tr');
		assert.lengthOf(vnode.children![0].children![0].children, 2);
		assert.isTrue(widgetBaseSpy.calledTwice);

		const callOneArgs = widgetBaseSpy.getCall(0).args[0];
		assert.deepEqual(callOneArgs.properties.key, 'foo');
		assert.deepEqual(callOneArgs.properties.data, 'bar');

		const callTwoArgs = widgetBaseSpy.getCall(1).args[0];
		assert.deepEqual(callTwoArgs.properties.key, 'bar');
		assert.deepEqual(callTwoArgs.properties.data, 'foo');
	},
	'render with no columns'() {
		const properties = {
			registry: mockRegistry,
			id: 'id',
			dataProvider: new ArrayDataProvider<any>([{ id: 'id', foo: 'bar', bar: 'foo' }]),
			item: { id: 'id', foo: 'bar', bar: 'foo' },
			columns: <any> undefined
		};
		const row = createRow({ properties });

		row.__render__();
		assert.isTrue(widgetBaseSpy.notCalled);
	}
});
