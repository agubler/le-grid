import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import FactoryRegistry from '@dojo/widget-core/FactoryRegistry';
import { spy, stub, SinonSpy, SinonStub } from 'sinon';
import * as compose from '@dojo/compose/compose';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { createQueryStore } from '@dojo/stores/store/mixins/createQueryTransformMixin';

import createRow from '../../src/createRow';

let widgetBaseSpy: SinonSpy;
let getStub: SinonStub;
let isComposeFactoryStub: SinonStub;
let mockRegistry: FactoryRegistry;

registerSuite({
	name: 'createRow',
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
		const properties = {
			registry: mockRegistry,
			store: createQueryStore(),
			columns: [
				{ id: 'foo', label: 'foo' }
			],
			item: { foo: 'bar' }
		};

		const row = createRow({ properties });
		const vnode = <VNode> row.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div.grid-row');
		assert.strictEqual(vnode.properties!['role'], 'row');

		assert.lengthOf(vnode.children, 1);
		assert.isTrue(widgetBaseSpy.calledOnce);
		const args = widgetBaseSpy.getCall(0).args[0];
		assert.deepEqual(args, { properties: { registry: mockRegistry, columns: properties.columns, item: properties.item } });
	}
});
