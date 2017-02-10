import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import FactoryRegistry from '@dojo/widget-core/FactoryRegistry';
import { spy, stub, SinonSpy, SinonStub } from 'sinon';
import * as compose from '@dojo/compose/compose';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';

import { assertAppliedClasses } from './../support/classHelper';
import createHeader from '../../src/createHeader';
import * as css from '../../src/styles/gridHeader.css';

let widgetBaseSpy: SinonSpy;
let getStub: SinonStub;
let isComposeFactoryStub: SinonStub;
let mockRegistry: FactoryRegistry;

registerSuite({
	name: 'createHeader',
	beforeEach() {
		widgetBaseSpy = spy(createWidgetBase);
		getStub = stub().withArgs('grid-row-view').returns(widgetBaseSpy);
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
		const onSortRequest = (columnId: string, descending: boolean): void => {};
		const properties = {
			registry: mockRegistry,
			columns: [
				{ id: 'foo', label: 'foo' },
				{ id: 'bar', label: 'bar' }
			],
			onSortRequest
		};

		const row = createHeader({ properties });
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
		assert.isTrue(widgetBaseSpy.calledTwice);

		assert.deepEqual(widgetBaseSpy.getCall(0).args[0].properties.key, 'foo');
		assert.deepEqual(widgetBaseSpy.getCall(0).args[0].properties.id, 'foo');
		assert.deepEqual(widgetBaseSpy.getCall(0).args[0].properties.column, { id: 'foo', label: 'foo' });
		assert.isUndefined(widgetBaseSpy.getCall(0).args[0].properties.sortDetails);
		assert.isFunction(widgetBaseSpy.getCall(0).args[0].properties.onSortRequest);

		assert.deepEqual(widgetBaseSpy.getCall(1).args[0].properties.key, 'bar');
		assert.deepEqual(widgetBaseSpy.getCall(1).args[0].properties.id, 'bar');
		assert.deepEqual(widgetBaseSpy.getCall(1).args[0].properties.column, { id: 'bar', label: 'bar' });
		assert.isUndefined(widgetBaseSpy.getCall(1).args[0].properties.sortDetails);
		assert.isFunction(widgetBaseSpy.getCall(1).args[0].properties.onSortRequest);
	},
	'render with no columns'() {
		const properties = {
			registry: mockRegistry,
			columns: <any> undefined,
			onSortRequest: (columnId: string, descending: boolean): void => {}
		};
		const row = createHeader({ properties });

		row.__render__();
		assert.isTrue(widgetBaseSpy.notCalled);
	}
});
