import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import { assign } from '@dojo/core/lang';
import FactoryRegistry from '@dojo/widgets/FactoryRegistry';
import { spy, stub, SinonSpy, SinonStub } from 'sinon';
import * as compose from '@dojo/compose/compose';
import createWidgetBase from '@dojo/widgets/createWidgetBase';
import { createQueryStore } from '@dojo/stores/store/mixins/createQueryTransformMixin';

import createDgrid from '../../src/createDgrid';

let headerSpy: SinonSpy;
let bodySpy: SinonSpy;
let footerSpy: SinonSpy;
let isComposeFactoryStub: SinonStub;
let mockRegistry: FactoryRegistry;

registerSuite({
	name: 'createDgrid',
	beforeEach() {
		headerSpy = spy(createWidgetBase.mixin({ mixin: { header: true }}));
		bodySpy = spy(createWidgetBase.mixin({ mixin: { body: true }}));
		footerSpy = spy(createWidgetBase.mixin({ mixin: { footer: true }}));
		isComposeFactoryStub = stub(compose, 'isComposeFactory').returns(true);
		mockRegistry = <any> {
			get(value: string) {
				if (value === 'dgrid-header') {
					return headerSpy;
				}
				else if (value === 'dgrid-body') {
					return bodySpy;
				}
				else if (value === 'dgrid-footer') {
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
	'dgrid without pagination'() {
		const properties = {
			externalState: createQueryStore(),
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const dgrid = createDgrid({ properties });
		dgrid.registry = mockRegistry;
		const vnode = <VNode> dgrid.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div.dgrid-widgets.dgrid.dgrid-grid');
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
	'dgrid with pagination'() {
		const properties = {
			externalState: createQueryStore(),
			pagination: {
				itemsPerPage: 10
			},
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const dgrid = createDgrid({ properties });
		dgrid.registry = mockRegistry;
		const vnode = <VNode> dgrid.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div.dgrid-widgets.dgrid.dgrid-grid');
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
			externalState: createQueryStore(),
			pagination: {
				itemsPerPage: 10
			},
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const dgrid = createDgrid({ properties });
		spy(dgrid, 'invalidate');

		dgrid.registry = mockRegistry;
		let vnode = <VNode> dgrid.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div.dgrid-widgets.dgrid.dgrid-grid');
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

		dgrid.onSortRequest('foo', true);
		vnode = <VNode> dgrid.__render__();

		assert.isTrue((<any> dgrid).invalidate.called);
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
			externalState: createQueryStore(),
			pagination: {
				itemsPerPage: 10
			},
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const dgrid = createDgrid({ properties });
		spy(dgrid, 'invalidate');

		dgrid.registry = mockRegistry;
		let vnode = <VNode> dgrid.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div.dgrid-widgets.dgrid.dgrid-grid');
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

		dgrid.onPaginationRequest('2');
		vnode = <VNode> dgrid.__render__();

		assert.isTrue((<any> dgrid).invalidate.called);

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
			externalState: createQueryStore(),
			pagination: {
				itemsPerPage: 10
			},
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const customCell = createWidgetBase.override({});
		const dgrid = createDgrid({ properties });
		assert.notEqual(dgrid.registry!.get('dgrid-cell'), customCell);
		dgrid.setProperties(assign({ customCell }, properties));
		assert.strictEqual(dgrid.registry!.get('dgrid-cell'), customCell);
	},
	'external state updated on property change'() {
		const initialExternalState = createQueryStore({
			data: [
				{ id: '1', foo: 'bar' }
			]
		});
		const updatedExternalState = createQueryStore({
			data: [
				{ id: '9', baz: 'qux' }
			]
		});

		const properties = {
			externalState: initialExternalState,
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const dgrid = createDgrid({ properties });
		const promise = new Promise((resolve) => setTimeout(resolve, 10));
		return promise.then(() => {
			assert.deepEqual(dgrid['state'].afterAll[0], { id: '1', foo: 'bar' });
			dgrid.setProperties(assign(properties, { externalState: updatedExternalState }));
			const promise = new Promise((resolve) => setTimeout(resolve, 10));
			return promise.then(() => {
				assert.deepEqual(dgrid['state'].afterAll[0], { id: '9', baz: 'qux' });
			});
		});
	}
});
