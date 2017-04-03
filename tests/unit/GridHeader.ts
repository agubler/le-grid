import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import WidgetRegistry from '@dojo/widget-core/WidgetRegistry';
import { spy, stub, SinonSpy, SinonStub } from 'sinon';
import WidgetBase from '@dojo/widget-core/WidgetBase';

import { assertAppliedClasses } from './../support/classHelper';
import GridHeader from '../../src/GridHeader';
import * as css from '../../src/styles/gridHeader.m.css';

let widgetBaseSpy: SinonSpy;
let getStub: SinonStub;
let mockRegistry: WidgetRegistry;

registerSuite({
	name: 'GridHeader',
	beforeEach() {
		widgetBaseSpy = spy(WidgetBase.prototype, 'setProperties');
		getStub = stub().withArgs('grid-row-view').returns(WidgetBase);
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
	render() {
		const onSortRequest = (columnId: string, descending: boolean): void => {};
		const properties = {
			registry: mockRegistry,
			columns: [
				{ id: 'foo', label: 'foo' },
				{ id: 'bar', label: 'bar' }
			],
			onSortRequest
		};

		const row = new GridHeader();
		row.setProperties(properties);
		const vnode = <VNode> row.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div');
		assert.isTrue(assertAppliedClasses([css.gridHeader, css.gridHeaderRow], vnode.properties!.classes));
		assert.strictEqual(vnode.properties!['role'], 'row');
		assert.lengthOf(vnode.children, 1);
		assert.strictEqual(vnode.children![0].vnodeSelector, 'table');
		assert.isTrue(assertAppliedClasses([css.gridHeaderTable], vnode.children![0].properties!.classes));
		assert.strictEqual(vnode.children![0].properties!['role'], 'presentation');
		assert.lengthOf(vnode.children![0].children, 1);
		assert.strictEqual(vnode.children![0].children![0].vnodeSelector, 'tr');
		assert.lengthOf(vnode.children![0].children![0].children, 2);
		assert.isTrue(widgetBaseSpy.calledThrice);

		assert.deepEqual(widgetBaseSpy.getCall(1).args[0].key, 'foo');
		assert.deepEqual(widgetBaseSpy.getCall(1).args[0].id, 'foo');
		assert.deepEqual(widgetBaseSpy.getCall(1).args[0].column, { id: 'foo', label: 'foo' });
		assert.isUndefined(widgetBaseSpy.getCall(1).args[0].sortDetails);
		assert.isFunction(widgetBaseSpy.getCall(1).args[0].onSortRequest);

		assert.deepEqual(widgetBaseSpy.getCall(2).args[0].key, 'bar');
		assert.deepEqual(widgetBaseSpy.getCall(2).args[0].id, 'bar');
		assert.deepEqual(widgetBaseSpy.getCall(2).args[0].column, { id: 'bar', label: 'bar' });
		assert.isUndefined(widgetBaseSpy.getCall(2).args[0].sortDetails);
		assert.isFunction(widgetBaseSpy.getCall(2).args[0].onSortRequest);
	}
});
