import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import GridFooter from '../../src/GridFooter';
import { assertAppliedClasses } from './../support/classHelper';

import * as css from '../../src/styles/gridFooter.m.css';

registerSuite({
	name: 'GridFooter',
	render: {
		'renders footer without pagination'() {
			const properties = {
				totalCount: 100,
				onPaginationRequest(pageNumber: string) {}
			};
			const footer = new GridFooter();
			footer.setProperties(properties);

			const vnode = <VNode> footer.__render__();
			assert.strictEqual(vnode.vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.footer], vnode.properties!.classes));
			assert.lengthOf(vnode.children, 1);
			assert.strictEqual(vnode.children![0].vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.status], vnode.children![0].properties!.classes));
			assert.strictEqual(vnode.children![0].text, '100 results');
		},
		'renders footer with pagination - first page'() {
			const properties = {
				totalCount: 100,
				paginationDetails: {
					dataRangeStart: 0,
					dataRangeCount: 10,
					pageNumber: 1
				},
				onPaginationRequest(pageNumber: string) {}
			};
			const footer = new GridFooter();
			footer.setProperties(properties);

			const vnode = <VNode> footer.__render__();
			assert.strictEqual(vnode.vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.footer], vnode.properties!.classes));

			assert.strictEqual(vnode.children![0].vnodeSelector, 'div');
			assert.lengthOf(vnode.children![0].children, 2);
			assert.strictEqual(vnode.children![0].children![0].vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.status], vnode.children![0].children![0].properties!.classes));
			assert.strictEqual(vnode.children![0].children![0].text, '1 - 10 of 100 results');
			assert.strictEqual(vnode.children![0].children![1].vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.navigation], vnode.children![0].children![1].properties!.classes));

			assert.lengthOf(vnode.children![0].children![1].children, 3);
			assert.strictEqual(vnode.children![0].children![1].children![0].vnodeSelector, 'span');
			assert.isTrue(assertAppliedClasses([
				css.pageLink,
				css.previousPage,
				css.disabledPageLink
			], vnode.children![0].children![1].children![0].properties!.classes));
			assert.strictEqual(vnode.children![0].children![1].children![1].vnodeSelector, 'span');
			assert.lengthOf(vnode.children![0].children![1].children![1].children, 5);
			// more asserts
			assert.strictEqual(vnode.children![0].children![1].children![2].vnodeSelector, 'span');
			assert.isTrue(assertAppliedClasses([
				css.pageLink,
				css.nextPage
			], vnode.children![0].children![1].children![2].properties!.classes));
		},
		'renders footer with pagination - last page'() {
			const properties = {
				totalCount: 100,
				paginationDetails: {
					dataRangeStart: 90,
					dataRangeCount: 10
				},
				onPaginationRequest(pageNumber: string) {}
			};
			const footer = new GridFooter();
			footer.setProperties(properties);

			const vnode = <VNode> footer.__render__();
			assert.strictEqual(vnode.vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.footer], vnode.properties!.classes));

			assert.strictEqual(vnode.children![0].vnodeSelector, 'div');
			assert.lengthOf(vnode.children![0].children, 2);
			assert.strictEqual(vnode.children![0].children![0].vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.status], vnode.children![0].children![0].properties!.classes));

			assert.strictEqual(vnode.children![0].children![0].text, '91 - 100 of 100 results');
			assert.strictEqual(vnode.children![0].children![1].vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.navigation], vnode.children![0].children![1].properties!.classes));

			assert.lengthOf(vnode.children![0].children![1].children, 3);
			assert.strictEqual(vnode.children![0].children![1].children![0].vnodeSelector, 'span');
			assert.isTrue(assertAppliedClasses([
				css.pageLink,
				css.previousPage
			], vnode.children![0].children![1].children![0].properties!.classes));

			assert.strictEqual(vnode.children![0].children![1].children![1].vnodeSelector, 'span');
			assert.lengthOf(vnode.children![0].children![1].children![1].children, 5);
			// more asserts
			assert.strictEqual(vnode.children![0].children![1].children![2].vnodeSelector, 'span');
			assert.isTrue(assertAppliedClasses([
				css.pageLink,
				css.nextPage,
				css.disabledPageLink
			], vnode.children![0].children![1].children![2].properties!.classes));
		},
		'renders footer with pagination - middle page'() {
			const properties = {
				totalCount: 100,
				paginationDetails: {
					dataRangeStart: 50,
					dataRangeCount: 10,
					pageNumber: 5
				},
				onPaginationRequest(pageNumber: string) {}
			};
			const footer = new GridFooter();
			footer.setProperties(properties);

			const vnode = <VNode> footer.__render__();
			assert.strictEqual(vnode.vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.footer], vnode.properties!.classes));

			assert.strictEqual(vnode.children![0].vnodeSelector, 'div');
			assert.lengthOf(vnode.children![0].children, 2);
			assert.strictEqual(vnode.children![0].children![0].vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.status], vnode.children![0].children![0].properties!.classes));
			assert.strictEqual(vnode.children![0].children![0].text, '51 - 60 of 100 results');
			assert.strictEqual(vnode.children![0].children![1].vnodeSelector, 'div');
			assert.isTrue(assertAppliedClasses([css.navigation], vnode.children![0].children![1].properties!.classes));

			assert.lengthOf(vnode.children![0].children![1].children, 3);
			assert.strictEqual(vnode.children![0].children![1].children![0].vnodeSelector, 'span');
			assert.isTrue(assertAppliedClasses([
				css.pageLink,
				css.previousPage
			], vnode.children![0].children![1].children![0].properties!.classes));
			assert.strictEqual(vnode.children![0].children![1].children![1].vnodeSelector, 'span');
			assert.lengthOf(vnode.children![0].children![1].children![1].children, 9);
			// more asserts
			assert.strictEqual(vnode.children![0].children![1].children![2].vnodeSelector, 'span');
			assert.isTrue(assertAppliedClasses([
				css.pageLink,
				css.nextPage
			], vnode.children![0].children![1].children![2].properties!.classes));
		}
	},
	'page change proxies to property function'() {
		let requestedPageNumber = '';
		const properties = {
			totalCount: 100,
			paginationDetails: {
				dataRangeStart: 50,
				dataRangeCount: 10,
				pageNumber: 5
			},
			onPaginationRequest(pageNumber: string) {
				requestedPageNumber = pageNumber;
			}
		};
		const footer = new GridFooter();
		footer.setProperties(properties);
		footer.onClick(<any> { target: { attributes: { page: { value: 8 } } } });
		assert.equal(requestedPageNumber, 8);
	}
});
