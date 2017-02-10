import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import { assign } from '@dojo/core/lang';
import FactoryRegistry from '@dojo/widget-core/FactoryRegistry';
import { spy, SinonSpy } from 'sinon';
import WidgetBase from '@dojo/widget-core/WidgetBase';

import ArrayDataProvider from './../../src/providers/ArrayDataProvider';
import LeGrid from '../../src/LeGrid';
import * as css from '../../src/styles/grid.css';

let headerSpy: SinonSpy;
let bodySpy: SinonSpy;
let footerSpy: SinonSpy;
let mockRegistry: FactoryRegistry;

registerSuite({
	name: 'createGrid',
	beforeEach() {
		headerSpy = spy(class extends WidgetBase<any> { static header = true; });
		bodySpy = spy(class extends WidgetBase<any> { static body = true; });
		footerSpy = spy(class extends WidgetBase<any> { static footer = true; });

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
	'grid without pagination'() {
		const properties = {
			dataProvider: new ArrayDataProvider(),
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const grid = new LeGrid(properties);
		(<any> grid).registry = mockRegistry;
		const vnode = <VNode> grid.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div');
		assert.deepEqual(vnode.properties!.classes, { [css.grid]: true });
		assert.strictEqual(vnode.properties!['role'], 'grid');
		assert.isTrue(headerSpy.calledOnce);

		const headerProperties = headerSpy.getCall(0).args[0];
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

		const grid = new LeGrid(properties);
		(<any> grid).registry = mockRegistry;
		const vnode = <VNode> grid.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div');
		assert.deepEqual(vnode.properties!.classes, { [css.grid]: true });
		assert.strictEqual(vnode.properties!['role'], 'grid');
		assert.isTrue(headerSpy.calledOnce);

		const headerProperties = headerSpy.getCall(0).args[0];
		assert.strictEqual(headerProperties.registry, mockRegistry);
		assert.isUndefined(headerProperties.sortDetails);
		assert.deepEqual(headerProperties.columns, [ { id: 'foo', label: 'foo' } ]);

		assert.isTrue(bodySpy.calledOnce);
		assert.isTrue(footerSpy.calledOnce);

		// TODO more assert on params
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

		const grid = new LeGrid(properties);
		(<any> grid).registry = mockRegistry;
		spy(grid, 'invalidate');

		let vnode = <VNode> grid.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div');
		assert.deepEqual(vnode.properties!.classes, { [css.grid]: true });
		assert.strictEqual(vnode.properties!['role'], 'grid');
		assert.isTrue(headerSpy.calledOnce);

		let headerProperties = headerSpy.getCall(0).args[0];
		assert.strictEqual(headerProperties.registry, mockRegistry);
		assert.isUndefined(headerProperties.sortDetails);
		assert.deepEqual(headerProperties.columns, [ { id: 'foo', label: 'foo' } ]);

		assert.isTrue(bodySpy.calledOnce);
		assert.isTrue(footerSpy.calledOnce);

		headerSpy = spy(class extends WidgetBase<any> { static header = true; });
		bodySpy = spy(class extends WidgetBase<any> { static body = true; });
		footerSpy = spy(class extends WidgetBase<any> { static footer = true; });

		grid.onSortRequest('foo', true);
		vnode = <VNode> grid.__render__();

		assert.isTrue((<any> grid).invalidate.called);
		assert.isTrue(headerSpy.calledOnce);

		headerProperties = headerSpy.getCall(0).args[0];
		assert.strictEqual(headerProperties.registry, mockRegistry);
		assert.deepEqual(headerProperties.sortDetails, { columnId: 'foo', descending: true });
		assert.deepEqual(headerProperties.columns, [ { id: 'foo', label: 'foo' } ]);

		assert.isTrue(bodySpy.calledOnce);
		assert.isTrue(footerSpy.calledOnce);

		headerSpy = spy(class extends WidgetBase<any> { static header = true; });
		bodySpy = spy(class extends WidgetBase<any> { static body = true; });
		footerSpy = spy(class extends WidgetBase<any> { static footer = true; });

		grid.onSortRequest('foo', false);
		vnode = <VNode> grid.__render__();

		assert.isTrue((<any> grid).invalidate.called);
		assert.isTrue(headerSpy.calledOnce);

		headerProperties = headerSpy.getCall(0).args[0];
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

		const grid = new LeGrid(properties);
		(<any> grid).registry = mockRegistry;
		spy(grid, 'invalidate');

		let vnode = <VNode> grid.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div');
		assert.deepEqual(vnode.properties!.classes, { [css.grid]: true });
		assert.strictEqual(vnode.properties!['role'], 'grid');
		assert.isTrue(headerSpy.calledOnce);

		assert.isTrue(bodySpy.calledOnce);
		assert.isTrue(footerSpy.calledOnce);
		let footerProperties = footerSpy.getCall(0).args[0];

		assert.strictEqual(footerProperties.totalCount, 0);
		assert.deepEqual(footerProperties.paginationDetails, { dataRangeStart: 0, dataRangeCount: 10 });

		headerSpy = spy(class extends WidgetBase<any> { static header = true; });
		bodySpy = spy(class extends WidgetBase<any> { static body = true; });
		footerSpy = spy(class extends WidgetBase<any> { static footer = true; });

		grid.onPaginationRequest('2');
		vnode = <VNode> grid.__render__();

		assert.isTrue((<any> grid).invalidate.called);

		assert.isTrue(headerSpy.calledOnce);
		assert.isTrue(bodySpy.calledOnce);
		assert.isTrue(footerSpy.calledOnce);
		footerProperties = footerSpy.getCall(0).args[0];
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
		const grid: any = new LeGrid(properties);
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

		const grid = new LeGrid(properties);
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
