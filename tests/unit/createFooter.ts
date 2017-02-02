import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import createFooter from '../../src/createFooter';
import { assertAppliedClasses } from './../support/classHelper';

import css from '../../src/styles/gridFooter';

registerSuite({
	name: 'createFooter',
	render: {
		'renders footer without pagination'() {
			const properties = {
				totalCount: 100,
				onPaginationRequest(pageNumber: string) {}
			};
			const footer = createFooter({ properties });

			const vnode = <VNode> footer.__render__();
			assert.strictEqual(vnode.vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.classes.footer], vnode.properties!.classes));
			assert.lengthOf(vnode.children, 1);
			assert.strictEqual(vnode.children![0].vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.classes.status], vnode.children![0].properties!.classes));
			assert.strictEqual(vnode.children![0].text, '100 results');
		},
		'renders footer with pagination - first page'() {
			const properties = {
				totalCount: 100,
				pagination: {
					itemsPerPage: 10
				},
				paginationDetails: {
					dataRangeStart: 0,
					dataRangeCount: 10,
					pageNumber: 1
				},
				onPaginationRequest(pageNumber: string) {}
			};
			const footer = createFooter({ properties });

			const vnode = <VNode> footer.__render__();
			assert.strictEqual(vnode.vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.classes.footer], vnode.properties!.classes));

			assert.strictEqual(vnode.children![0].vnodeSelector, 'div');
			assert.lengthOf(vnode.children![0].children, 2);
			assert.strictEqual(vnode.children![0].children![0].vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.classes.status], vnode.children![0].children![0].properties!.classes));
			assert.strictEqual(vnode.children![0].children![0].text, '1 - 10 of 100 results');
			assert.strictEqual(vnode.children![0].children![1].vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.classes.navigation], vnode.children![0].children![1].properties!.classes));

			assert.lengthOf(vnode.children![0].children![1].children, 3);
			assert.strictEqual(vnode.children![0].children![1].children![0].vnodeSelector, 'span');
			assert.isTrue(assertAppliedClasses([
				css.classes.pageLink,
				css.classes.previousPage,
				css.classes.disabledPageLink
			], vnode.children![0].children![1].children![0].properties!.classes));
			assert.strictEqual(vnode.children![0].children![1].children![1].vnodeSelector, 'span');
			assert.lengthOf(vnode.children![0].children![1].children![1].children, 5);
			// more asserts
			assert.strictEqual(vnode.children![0].children![1].children![2].vnodeSelector, 'span');
			assert.isTrue(assertAppliedClasses([
				css.classes.pageLink,
				css.classes.previousPage
			], vnode.children![0].children![1].children![2].properties!.classes));
		},
		'renders footer with pagination - last page'() {
			const properties = {
				totalCount: 100,
				pagination: {
					itemsPerPage: 10
				},
				paginationDetails: {
					dataRangeStart: 90,
					dataRangeCount: 10,
					pageNumber: 9
				},
				onPaginationRequest(pageNumber: string) {}
			};
			const footer = createFooter({ properties });

			const vnode = <VNode> footer.__render__();
			assert.strictEqual(vnode.vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.classes.footer], vnode.properties!.classes));

			assert.strictEqual(vnode.children![0].vnodeSelector, 'div');
			assert.lengthOf(vnode.children![0].children, 2);
			assert.strictEqual(vnode.children![0].children![0].vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.classes.status], vnode.children![0].children![0].properties!.classes));

			assert.strictEqual(vnode.children![0].children![0].text, '91 - 100 of 100 results');
			assert.strictEqual(vnode.children![0].children![1].vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.classes.navigation], vnode.children![0].children![1].properties!.classes));

			assert.lengthOf(vnode.children![0].children![1].children, 3);
			assert.strictEqual(vnode.children![0].children![1].children![0].vnodeSelector, 'span');
			assert.isTrue(assertAppliedClasses([
				css.classes.pageLink,
				css.classes.previousPage
			], vnode.children![0].children![1].children![0].properties!.classes));

			assert.strictEqual(vnode.children![0].children![1].children![1].vnodeSelector, 'span');
			assert.lengthOf(vnode.children![0].children![1].children![1].children, 7);
			// more asserts
			assert.strictEqual(vnode.children![0].children![1].children![2].vnodeSelector, 'span');
			assert.isTrue(assertAppliedClasses([
				css.classes.pageLink,
				css.classes.previousPage
			], vnode.children![0].children![1].children![2].properties!.classes));
		},
		'renders footer with pagination - middle page'() {
			const properties = {
				totalCount: 100,
				pagination: {
					itemsPerPage: 10
				},
				paginationDetails: {
					dataRangeStart: 50,
					dataRangeCount: 10,
					pageNumber: 5
				},
				onPaginationRequest(pageNumber: string) {}
			};
			const footer = createFooter({ properties });

			const vnode = <VNode> footer.__render__();
			assert.strictEqual(vnode.vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.classes.footer], vnode.properties!.classes));

			assert.strictEqual(vnode.children![0].vnodeSelector, 'div');
			assert.lengthOf(vnode.children![0].children, 2);
			assert.strictEqual(vnode.children![0].children![0].vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.classes.status], vnode.children![0].children![0].properties!.classes));
			assert.strictEqual(vnode.children![0].children![0].text, '51 - 60 of 100 results');
			assert.strictEqual(vnode.children![0].children![1].vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.classes.navigation], vnode.children![0].children![1].properties!.classes));

			assert.lengthOf(vnode.children![0].children![1].children, 3);
			assert.strictEqual(vnode.children![0].children![1].children![0].vnodeSelector, 'span');
			assert.isTrue(assertAppliedClasses([
				css.classes.pageLink,
				css.classes.previousPage
			], vnode.children![0].children![1].children![0].properties!.classes));
			assert.strictEqual(vnode.children![0].children![1].children![1].vnodeSelector, 'span');
			assert.lengthOf(vnode.children![0].children![1].children![1].children, 9);
			// more asserts
			assert.strictEqual(vnode.children![0].children![1].children![2].vnodeSelector, 'span');
			assert.isTrue(assertAppliedClasses([
				css.classes.pageLink,
				css.classes.previousPage
			], vnode.children![0].children![1].children![2].properties!.classes));
		}
	}
});
