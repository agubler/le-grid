import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import { assign } from '@dojo/core/lang';
import FactoryRegistry from '@dojo/widget-core/FactoryRegistry';
import { spy, stub, SinonSpy, SinonStub } from 'sinon';
import * as compose from '@dojo/compose/compose';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { createQueryStore } from '@dojo/stores/store/mixins/createQueryTransformMixin';

import createGrid from '../../src/createGrid';

let headerSpy: SinonSpy;
let bodySpy: SinonSpy;
let footerSpy: SinonSpy;
let isComposeFactoryStub: SinonStub;
let mockRegistry: FactoryRegistry;

registerSuite({
	name: 'createGrid',
	beforeEach() {
		headerSpy = spy(createWidgetBase.mixin({ mixin: { header: true }}));
		bodySpy = spy(createWidgetBase.mixin({ mixin: { body: true }}));
		footerSpy = spy(createWidgetBase.mixin({ mixin: { footer: true }}));
		isComposeFactoryStub = stub(compose, 'isComposeFactory').returns(true);
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
		isComposeFactoryStub.restore();
	},
	'grid without pagination'() {
		const properties = {
			store: createQueryStore(),
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const grid = createGrid({ properties });
		grid.registry = mockRegistry;
		const vnode = <VNode> grid.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div.grid-widgets.grid.grid-grid');
		assert.strictEqual(vnode.properties!['role'], 'grid');
		assert.isTrue(headerSpy.calledOnce);

		const headerProperties = headerSpy.getCall(0).args[0].properties;
		assert.strictEqual(headerProperties.registry, mockRegistry);
		assert.isUndefined(headerProperties.sortDetails);
		assert.deepEqual(headerProperties.columns, [ { id: 'foo', label: 'foo' } ]);

		assert.isTrue(bodySpy.calledOnce);
		assert.isTrue(footerSpy.calledOnce);

		// TODO more assert on params
	},
	'grid with pagination'() {
		const properties = {
			store: createQueryStore(),
			pagination: {
				itemsPerPage: 10
			},
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const grid = createGrid({ properties });
		grid.registry = mockRegistry;
		const vnode = <VNode> grid.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div.grid-widgets.grid.grid-grid');
		assert.strictEqual(vnode.properties!['role'], 'grid');
		assert.isTrue(headerSpy.calledOnce);

		const headerProperties = headerSpy.getCall(0).args[0].properties;
		assert.strictEqual(headerProperties.registry, mockRegistry);
		assert.isUndefined(headerProperties.sortDetails);
		assert.deepEqual(headerProperties.columns, [ { id: 'foo', label: 'foo' } ]);

		assert.isTrue(bodySpy.calledOnce);
		assert.isTrue(footerSpy.calledOnce);

		// TODO more assert on params
	},
	'onSortRequest'() {
		const properties = {
			store: createQueryStore(),
			pagination: {
				itemsPerPage: 10
			},
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const grid = createGrid({ properties });
		spy(grid, 'invalidate');

		grid.registry = mockRegistry;
		let vnode = <VNode> grid.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div.grid-widgets.grid.grid-grid');
		assert.strictEqual(vnode.properties!['role'], 'grid');
		assert.isTrue(headerSpy.calledOnce);

		let headerProperties = headerSpy.getCall(0).args[0].properties;
		assert.strictEqual(headerProperties.registry, mockRegistry);
		assert.isUndefined(headerProperties.sortDetails);
		assert.deepEqual(headerProperties.columns, [ { id: 'foo', label: 'foo' } ]);

		assert.isTrue(bodySpy.calledOnce);
		assert.isTrue(footerSpy.calledOnce);

		headerSpy = spy(createWidgetBase.mixin({ mixin: { header: true }}));
		bodySpy = spy(createWidgetBase.mixin({ mixin: { body: true }}));
		footerSpy = spy(createWidgetBase.mixin({ mixin: { footer: true }}));

		grid.onSortRequest('foo', true);
		vnode = <VNode> grid.__render__();

		assert.isTrue((<any> grid).invalidate.called);
		assert.isTrue(headerSpy.calledOnce);

		headerProperties = headerSpy.getCall(0).args[0].properties;
		assert.strictEqual(headerProperties.registry, mockRegistry);
		assert.deepEqual(headerProperties.sortDetails, { columnId: 'foo', descending: true });
		assert.deepEqual(headerProperties.columns, [ { id: 'foo', label: 'foo' } ]);

		assert.isTrue(bodySpy.calledOnce);
		assert.isTrue(footerSpy.calledOnce);
	},
	'onPaginationRequest'() {
		const properties = {
			store: createQueryStore(),
			pagination: {
				itemsPerPage: 10
			},
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const grid = createGrid({ properties });
		spy(grid, 'invalidate');

		grid.registry = mockRegistry;
		let vnode = <VNode> grid.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div.grid-widgets.grid.grid-grid');
		assert.strictEqual(vnode.properties!['role'], 'grid');
		assert.isTrue(headerSpy.calledOnce);

		assert.isTrue(bodySpy.calledOnce);
		assert.isTrue(footerSpy.calledOnce);
		let footerProperties = footerSpy.getCall(0).args[0].properties;

		assert.strictEqual(footerProperties.totalCount, 0);
		assert.deepEqual(footerProperties.paginationDetails, { dataRangeStart: 0, dataRangeCount: 10, pageNumber: 1 });
		assert.isTrue(footerProperties.pagination);

		headerSpy = spy(createWidgetBase.mixin({ mixin: { header: true }}));
		bodySpy = spy(createWidgetBase.mixin({ mixin: { body: true }}));
		footerSpy = spy(createWidgetBase.mixin({ mixin: { footer: true }}));

		grid.onPaginationRequest('2');
		vnode = <VNode> grid.__render__();

		assert.isTrue((<any> grid).invalidate.called);

		assert.isTrue(headerSpy.calledOnce);
		assert.isTrue(bodySpy.calledOnce);
		assert.isTrue(footerSpy.calledOnce);
		footerProperties = footerSpy.getCall(0).args[0].properties;
		assert.strictEqual(footerProperties.totalCount, 0);
		assert.deepEqual(footerProperties.paginationDetails, { dataRangeStart: 10, dataRangeCount: 10, pageNumber: 2 });
		assert.isTrue(footerProperties.pagination);
	},
	'custom cell applied on property change'() {
		const properties = {
			store: createQueryStore(),
			pagination: {
				itemsPerPage: 10
			},
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const customCell = createWidgetBase.override({});
		const grid = createGrid({ properties });
		assert.notEqual(grid.registry!.get('grid-cell'), customCell);
		grid.setProperties(assign({ customCell }, properties));
		assert.strictEqual(grid.registry!.get('grid-cell'), customCell);
	},
	'external state updated on property change'() {
		const initialstore = createQueryStore({
			data: [
				{ id: '1', foo: 'bar' }
			]
		});
		const updatedstore = createQueryStore({
			data: [
				{ id: '9', baz: 'qux' }
			]
		});

		const properties = {
			store: initialstore,
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const grid = createGrid({ properties });
		const promise = new Promise((resolve) => setTimeout(resolve, 10));
		return promise.then(() => {
			assert.deepEqual(grid['state'][0], { id: '1', foo: 'bar' });
			grid.setProperties(assign(properties, { store: updatedstore }));
			const promise = new Promise((resolve) => setTimeout(resolve, 10));
			return promise.then(() => {
				assert.deepEqual(grid['state'][0], { id: '9', baz: 'qux' });
			});
		});
	}
});
