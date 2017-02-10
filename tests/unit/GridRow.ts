import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import FactoryRegistry from '@dojo/widget-core/FactoryRegistry';
import { spy, stub, SinonSpy, SinonStub } from 'sinon';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';

import { Map as ImmutableMap } from 'immutable';
import { assertAppliedClasses } from './../support/classHelper';
import ArrayDataProvider from './../../src/providers/ArrayDataProvider';
import GridRow from '../../src/GridRow';
import * as css from '../../src/styles/gridRow.css';

let widgetBaseSpy: SinonSpy;
let getStub: SinonStub;
let mockRegistry: FactoryRegistry;

registerSuite({
	name: 'GridRow',
	beforeEach() {
		widgetBaseSpy = spy(WidgetBase);
		getStub = stub().withArgs('grid-cell').returns(widgetBaseSpy);
		mockRegistry = <any> {
			get: getStub,
			has() {
				return true;
			}
		};
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

		const row = new GridRow(properties);
		const vnode = <VNode> row.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div');
		assert.isTrue(assertAppliedClasses([css.gridRow], vnode.properties!.classes));
		assert.strictEqual(vnode.properties!['role'], 'row');

		assert.lengthOf(vnode.children, 1);
		assert.strictEqual(vnode.children![0].vnodeSelector, 'table');
		assert.lengthOf(vnode.children![0].children, 1);
		assert.strictEqual(vnode.children![0].children![0].vnodeSelector, 'tr');
		assert.lengthOf(vnode.children![0].children![0].children, 2);
		assert.isTrue(widgetBaseSpy.calledTwice);

		const callOneArgs = widgetBaseSpy.getCall(0).args[0];
		assert.deepEqual(callOneArgs.key, 'foo');
		assert.deepEqual(callOneArgs.data, 'bar');
		assert.isUndefined(callOneArgs.renderer);

		const callTwoArgs = widgetBaseSpy.getCall(1).args[0];
		assert.deepEqual(callTwoArgs.key, 'bar');
		assert.deepEqual(callTwoArgs.data, 'foo');
		assert.isFunction(callTwoArgs.renderer);
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

		const row = new GridRow(properties);
		const vnode = <VNode> row.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div');
		assert.isTrue(assertAppliedClasses([css.gridRow], vnode.properties!.classes));
		assert.strictEqual(vnode.properties!['role'], 'row');

		assert.lengthOf(vnode.children, 1);
		assert.strictEqual(vnode.children![0].vnodeSelector, 'table');
		assert.lengthOf(vnode.children![0].children, 1);
		assert.strictEqual(vnode.children![0].children![0].vnodeSelector, 'tr');
		assert.lengthOf(vnode.children![0].children![0].children, 2);
		assert.isTrue(widgetBaseSpy.calledTwice);

		const callOneArgs = widgetBaseSpy.getCall(0).args[0];
		assert.deepEqual(callOneArgs.key, 'foo');
		assert.deepEqual(callOneArgs.data, 'bar');

		const callTwoArgs = widgetBaseSpy.getCall(1).args[0];
		assert.deepEqual(callTwoArgs.key, 'bar');
		assert.deepEqual(callTwoArgs.data, 'foo');
	},
	'render with no columns'() {
		const properties = {
			registry: mockRegistry,
			id: 'id',
			dataProvider: new ArrayDataProvider<any>([{ id: 'id', foo: 'bar', bar: 'foo' }]),
			item: { id: 'id', foo: 'bar', bar: 'foo' },
			columns: <any> undefined
		};
		const row = new GridRow(properties);

		row.__render__();
		assert.isTrue(widgetBaseSpy.notCalled);
	}
});
