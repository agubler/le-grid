import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import createCell from '../../src/createCell';

registerSuite({
	name: 'createCell',
	render: {
		'data property used as cell text node'() {
			const cell = createCell({ properties: { data: 'Hello, World!' } });

			const vnode = <VNode> cell.__render__();
			assert.strictEqual(vnode.vnodeSelector, 'td.grid-cell');
			assert.strictEqual(vnode.text, 'Hello, World!');
		},
		'data propety value passed through renderer when provided'() {
			const renderer = (value: any) => {
				return value.replace('World', 'Dojo');
			};
			const cell = createCell({ properties: { data: 'Hello, World!', renderer } });

			const vnode = <VNode> cell.__render__();
			assert.strictEqual(vnode.vnodeSelector, 'td.grid-cell');
			assert.strictEqual(vnode.text, 'Hello, Dojo!');
		},
		'null is returned when no data property'() {
			const cell = createCell({});

			const vnode = <VNode> cell.__render__();
			assert.strictEqual(vnode.vnodeSelector, 'td.grid-cell');
			assert.isUndefined(vnode.text);
		},
		'cell data is stringified'() {
			const cell = createCell({ properties: { data: <any> 1234 } });

			const vnode = <VNode> cell.__render__();
			assert.strictEqual(vnode.vnodeSelector, 'td.grid-cell');
			assert.strictEqual(vnode.text, '1234');
		}
	}
});
