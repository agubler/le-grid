import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import { assign } from '@dojo/core/lang';
import WidgetRegistry from '@dojo/widget-core/WidgetRegistry';
import { spy, SinonSpy } from 'sinon';
import WidgetBase from '@dojo/widget-core/WidgetBase';

import ArrayDataProvider from './../../src/providers/ArrayDataProvider';
import LeGrid from '../../src/LeGrid';
import * as css from '../../src/styles/grid.m.css';

let headerSpy: SinonSpy;
let headerSetPropertiesSpy: SinonSpy;
let bodySpy: SinonSpy;
let bodySetPropertiesSpy: SinonSpy;
let footerSpy: SinonSpy;
let footerSetPropertiesSpy: SinonSpy;
let mockRegistry: WidgetRegistry;

function createSpies() {
	headerSpy = spy(class extends WidgetBase<any> { static header = true; });
	bodySpy = spy(class extends WidgetBase<any> { static body = true; });
	footerSpy = spy(class extends WidgetBase<any> { static footer = true; });
	headerSetPropertiesSpy = spy(headerSpy.prototype, 'setProperties');
	bodySetPropertiesSpy = spy(bodySpy.prototype, 'setProperties');
	footerSetPropertiesSpy = spy(footerSpy.prototype, 'setProperties');
}

registerSuite({
	name: 'LeGrid',
	beforeEach() {
		createSpies();

		mockRegistry = <any> {
			get(value: string) {
				if (value === 'grid-header') {
					return headerSpy;
				}
				else if (value === 'grid-body') {
					return bodySpy;
				}
				else if (value === 'grid-footer') {
					return footerSpy;
				}
			},
			has() {
				return true;
			}
		};
	},
	afterEach() {
		headerSetPropertiesSpy.restore();
		bodySetPropertiesSpy.restore();
		footerSetPropertiesSpy.restore();
	},
	'grid without pagination'() {
		const properties = {
			dataProvider: new ArrayDataProvider(),
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const grid = new LeGrid();
		grid.setProperties(properties);
		(<any> grid).registry = mockRegistry;
		const vnode = <VNode> grid.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div');
		assert.deepEqual(vnode.properties!.classes, { [css.grid]: true });
		assert.strictEqual(vnode.properties!['role'], 'grid');
		assert.isTrue(headerSpy.calledOnce);

		const headerProperties = headerSetPropertiesSpy.getCall(0).args[0];
		assert.strictEqual(headerProperties.registry, mockRegistry);
		assert.isUndefined(headerProperties.sortDetails);
		assert.deepEqual(headerProperties.columns, [ { id: 'foo', label: 'foo' } ]);

		assert.isTrue(bodySpy.calledOnce);
		assert.isTrue(footerSpy.calledOnce);
	},
	'grid with pagination'() {
		const properties = {
			dataProvider: new ArrayDataProvider(),
			pagination: {
				itemsPerPage: 10
			},
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const grid = new LeGrid();
		grid.setProperties(properties);
		(<any> grid).registry = mockRegistry;
		const vnode = <VNode> grid.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div');
		assert.deepEqual(vnode.properties!.classes, { [css.grid]: true });
		assert.strictEqual(vnode.properties!['role'], 'grid');
		assert.isTrue(headerSpy.calledOnce);

		const headerProperties = headerSetPropertiesSpy.getCall(0).args[0];
		assert.strictEqual(headerProperties.registry, mockRegistry);
		assert.isUndefined(headerProperties.sortDetails);
		assert.deepEqual(headerProperties.columns, [ { id: 'foo', label: 'foo' } ]);

		assert.isTrue(bodySpy.calledOnce);
		assert.isTrue(footerSpy.calledOnce);
	},
	'onSortRequest'() {
		const properties = {
			dataProvider: new ArrayDataProvider(),
			pagination: {
				itemsPerPage: 10
			},
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const grid = new LeGrid();
		grid.setProperties(properties);
		(<any> grid).registry = mockRegistry;
		spy(grid, 'invalidate');

		let vnode = <VNode> grid.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div');
		assert.deepEqual(vnode.properties!.classes, { [css.grid]: true });
		assert.strictEqual(vnode.properties!['role'], 'grid');
		assert.isTrue(headerSpy.calledOnce);

		let headerProperties = headerSetPropertiesSpy.getCall(0).args[0];
		assert.strictEqual(headerProperties.registry, mockRegistry);
		assert.isUndefined(headerProperties.sortDetails);
		assert.deepEqual(headerProperties.columns, [ { id: 'foo', label: 'foo' } ]);

		assert.isTrue(bodySpy.calledOnce);
		assert.isTrue(footerSpy.calledOnce);

		createSpies();

		grid.onSortRequest('foo', true);
		vnode = <VNode> grid.__render__();

		assert.isTrue((<any> grid).invalidate.called);
		assert.isTrue(headerSpy.calledOnce);

		headerProperties = headerSetPropertiesSpy.getCall(0).args[0];
		assert.strictEqual(headerProperties.registry, mockRegistry);
		assert.deepEqual(headerProperties.sortDetails, { columnId: 'foo', descending: true });
		assert.deepEqual(headerProperties.columns, [ { id: 'foo', label: 'foo' } ]);

		assert.isTrue(bodySpy.calledOnce);
		assert.isTrue(footerSpy.calledOnce);

		createSpies();

		grid.onSortRequest('foo', false);
		vnode = <VNode> grid.__render__();

		assert.isTrue((<any> grid).invalidate.called);
		assert.isTrue(headerSpy.calledOnce);

		headerProperties = headerSetPropertiesSpy.getCall(0).args[0];
		assert.strictEqual(headerProperties.registry, mockRegistry);
		assert.deepEqual(headerProperties.sortDetails, { columnId: 'foo', descending: false });
		assert.deepEqual(headerProperties.columns, [ { id: 'foo', label: 'foo' } ]);

		assert.isTrue(bodySpy.calledOnce);
		assert.isTrue(footerSpy.calledOnce);
	},
	'onPaginationRequest'() {
		const properties = {
			dataProvider: new ArrayDataProvider(),
			pagination: {
				itemsPerPage: 10
			},
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const grid = new LeGrid();
		grid.setProperties(properties);
		(<any> grid).registry = mockRegistry;
		spy(grid, 'invalidate');

		let vnode = <VNode> grid.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div');
		assert.deepEqual(vnode.properties!.classes, { [css.grid]: true });
		assert.strictEqual(vnode.properties!['role'], 'grid');
		assert.isTrue(headerSpy.calledOnce);

		assert.isTrue(bodySpy.calledOnce);
		assert.isTrue(footerSpy.calledOnce);
		let footerProperties = footerSetPropertiesSpy.getCall(0).args[0];

		assert.strictEqual(footerProperties.totalCount, 0);
		assert.deepEqual(footerProperties.paginationDetails, { dataRangeStart: 0, dataRangeCount: 10 });

		createSpies();

		grid.onPaginationRequest('2');
		vnode = <VNode> grid.__render__();

		assert.isTrue((<any> grid).invalidate.called);

		assert.isTrue(headerSpy.calledOnce);
		assert.isTrue(bodySpy.calledOnce);
		assert.isTrue(footerSpy.calledOnce);
		footerProperties = footerSetPropertiesSpy.getCall(0).args[0];
		assert.strictEqual(footerProperties.totalCount, 0);
		assert.deepEqual(footerProperties.paginationDetails, { dataRangeStart: 10, dataRangeCount: 10 });
	},
	'custom cell applied on property change'() {
		const properties = {
			dataProvider: new ArrayDataProvider(),
			pagination: {
				itemsPerPage: 10
			},
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		class CustomCell extends WidgetBase<any> {}
		const customCellWrapper = () => { return CustomCell; };
		const grid: any = new LeGrid();
		grid.setProperties(properties);
		assert.notEqual(grid.registry!.get('grid-cell'), CustomCell);
		grid.setProperties(assign({ customCell: customCellWrapper }, properties));
		assert.strictEqual(grid.registry!.get('grid-cell'), CustomCell);
		grid.setProperties(assign(<any> { customCell: customCellWrapper }, properties, { pagination: { itemsPerPage: 15 }}));
		assert.strictEqual(grid.registry!.get('grid-cell'), CustomCell);
	},
	'data provider updated on property change'(this: any) {
		this.skip();
		const initialstore = new ArrayDataProvider<any>([{ id: '1', foo: 'bar' }]);
		const updatedstore = new ArrayDataProvider<any>([{ id: '9', baz: 'qux' }]);

		const properties = {
			dataProvider: initialstore,
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const grid = new LeGrid();
		grid.setProperties(properties);
		const promise = new Promise((resolve) => setTimeout(resolve, 10));
		return promise.then(() => {
			assert.deepEqual(grid.data, {
				items: [{ id: '1', foo: 'bar' }],
				totalCount: 1,
				state: {}
			});
			grid.setProperties(assign(properties, { dataProvider: updatedstore }));
			const promise = new Promise((resolve) => setTimeout(resolve, 10));
			return promise.then(() => {
				assert.deepEqual(grid.data, { id: '9', baz: 'qux' });
			});
		});
	}
});
