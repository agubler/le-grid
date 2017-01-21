import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import createRowView from '../../src/createRowView';
import FactoryRegistry from '@dojo/widgets/FactoryRegistry';

registerSuite({
	name: 'createRowView',
	render() {
		const registry = new FactoryRegistry();
		const properties = {
			registry,
			columns: [
				{ id: 'foo', label: 'foo' }
			],
			item: { foo: 'bar' }
		};
		const cell = createRowView({ properties });

		const vnode = <VNode> cell.__render__();
		console.log(vnode);
		assert.strictEqual(vnode.vnodeSelector, 'tr.dgrid-row');
	}
});
