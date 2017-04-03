import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import GridCell from '../../src/GridCell';
import { assertAppliedClasses } from './../support/classHelper';
import * as css from '../../src/styles/gridCell.m.css';

registerSuite({
	name: 'GridCell',
	render: {
		'data property used as cell text node'() {
			const cell = new GridCell();
			cell.setProperties({ data: 'Hello, World!' });

			const vnode = <VNode> cell.__render__();
			assert.strictEqual(vnode.vnodeSelector, 'td');
			assert.isTrue(assertAppliedClasses([css.cell], vnode.properties!.classes));
			assert.strictEqual(vnode.text, 'Hello, World!');
		},
		'data propety value passed through renderer when provided'() {
			const renderer = (value: any) => {
				return value.replace('World', 'Dojo');
			};
			const cell = new GridCell();
			cell.setProperties({ data: 'Hello, World!', renderer });

			const vnode = <VNode> cell.__render__();
			assert.strictEqual(vnode.vnodeSelector, 'td');
			assert.isTrue(assertAppliedClasses([css.cell], vnode.properties!.classes));
			assert.strictEqual(vnode.text, 'Hello, Dojo!');
		},
		'null is returned when no data property'() {
			const cell = new GridCell();

			const vnode = <VNode> cell.__render__();
			assert.strictEqual(vnode.vnodeSelector, 'td');
			assert.isTrue(assertAppliedClasses([css.cell], vnode.properties!.classes));
			assert.isUndefined(vnode.text);
		},
		'cell data is stringified'() {
			const cell = new GridCell();
			cell.setProperties({ data: <any> 1234 });

			const vnode = <VNode> cell.__render__();
			assert.strictEqual(vnode.vnodeSelector, 'td');
			assert.isTrue(assertAppliedClasses([css.cell], vnode.properties!.classes));
			assert.strictEqual(vnode.text, '1234');
		}
	}
});
