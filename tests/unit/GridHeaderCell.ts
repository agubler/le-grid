import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import GridHeaderCell from '../../src/GridHeaderCell';
import { assertAppliedClasses } from './../support/classHelper';

import * as css from '../../src/styles/gridHeaderCell.css';

registerSuite({
	name: 'GridHeaderCell',
	render: {
		'renders non sortable header cell'() {
			let clicked = false;
			const properties = {
				onSortRequest() { clicked = true; },
				column: {
					id: 'id',
					label: 'foo',
					sortable: false
				},
				id: 'id'
			};
			const headerCell = new GridHeaderCell(properties);

			const vnode = <VNode> headerCell.__render__();
			assert.strictEqual(vnode.vnodeSelector, 'th');
			assert.isTrue(assertAppliedClasses([css.cell], vnode.properties!.classes));
			assert.isUndefined(vnode.properties!.onclick);
			assert.equal(vnode.properties!['role'], 'columnheader');
			assert.lengthOf(vnode.children, 1);
			assert.equal(vnode.children![0].vnodeSelector, 'span');
			assert.equal(vnode.children![0].text, 'foo');
		},
		'renders sortable header cell with no sort direction'() {
			let clicked = false;
			const properties = {
				onSortRequest() { clicked = true; },
				column: {
					id: 'id',
					label: 'foo',
					sortable: true
				},
				id: 'id'
			};
			const headerCell = new GridHeaderCell(properties);

			const vnode = <VNode> headerCell.__render__();
			vnode.properties!.onclick!.call(headerCell);

			assert.strictEqual(vnode.vnodeSelector, 'th');
			assert.isTrue(assertAppliedClasses([css.cell], vnode.properties!.classes));
			assert.isFunction(vnode.properties!.onclick);
			assert.isTrue(clicked);
			assert.equal(vnode.properties!['role'], 'columnheader');
			assert.lengthOf(vnode.children, 1);
			assert.equal(vnode.children![0].vnodeSelector, 'span');
			assert.equal(vnode.children![0].text, 'foo');
		},
		'renders sortable header cell with descending direction'() {
			let clicked = false;
			const properties = {
				onSortRequest() { clicked = true; },
				column: {
					id: 'id',
					label: 'foo',
					sortable: true
				},
				sortDetails: {
					columnId: 'id',
					descending: true
				},
				id: 'id'
			};
			const headerCell = new GridHeaderCell(properties);

			const vnode = <VNode> headerCell.__render__();
			vnode.properties!.onclick!.call(headerCell);

			assert.strictEqual(vnode.vnodeSelector, 'th');
			assert.isTrue(assertAppliedClasses([css.cell], vnode.properties!.classes));
			assert.isFunction(vnode.properties!.onclick);
			assert.isTrue(clicked);
			assert.equal(vnode.properties!['role'], 'columnheader');
			assert.lengthOf(vnode.children, 2);
			assert.equal(vnode.children![0].vnodeSelector, 'span');
			assert.equal(vnode.children![0].text, 'foo');
			assert.equal(vnode.children![1].vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.sortUp, css.sortArrow, css.icon], vnode.children![1].properties!.classes));
			assert.equal(vnode.children![1].properties!['role'], 'presentation');
		},
		'renders sortable header cell with ascending direction'() {
			let clicked = false;
			const properties = {
				onSortRequest() { clicked = true; },
				column: {
					id: 'id',
					label: 'foo',
					sortable: true
				},
				sortDetails: {
					columnId: 'id',
					descending: false
				},
				id: 'id'
			};
			const headerCell = new GridHeaderCell(properties);

			const vnode = <VNode> headerCell.__render__();
			vnode.properties!.onclick!.call(headerCell);

			assert.strictEqual(vnode.vnodeSelector, 'th');
			assert.isTrue(assertAppliedClasses([css.cell], vnode.properties!.classes));
			assert.isFunction(vnode.properties!.onclick);
			assert.isTrue(clicked);
			assert.equal(vnode.properties!['role'], 'columnheader');
			assert.lengthOf(vnode.children, 2);
			assert.equal(vnode.children![0].vnodeSelector, 'span');
			assert.equal(vnode.children![0].text, 'foo');
			assert.equal(vnode.children![1].vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.sortArrow, css.icon], vnode.children![1].properties!.classes));
			assert.equal(vnode.children![1].properties!['role'], 'presentation');
		}
	}
});
