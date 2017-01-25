import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import createFooter from '../../src/createFooter';

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
			assert.strictEqual(vnode.vnodeSelector, 'div.grid-footer');
			assert.lengthOf(vnode.children, 1);
			assert.strictEqual(vnode.children![0].vnodeSelector, 'div.grid-status');
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
			assert.strictEqual(vnode.vnodeSelector, 'div.grid-footer');

			assert.strictEqual(vnode.children![0].vnodeSelector, 'div.grid-pagination');
			assert.lengthOf(vnode.children![0].children, 2);
			assert.strictEqual(vnode.children![0].children![0].vnodeSelector, 'div.grid-status');
			assert.strictEqual(vnode.children![0].children![0].text, '1 - 10 of 100 results');
			assert.strictEqual(vnode.children![0].children![1].vnodeSelector, 'div.grid-navigation');

			assert.lengthOf(vnode.children![0].children![1].children, 3);
			assert.strictEqual(vnode.children![0].children![1].children![0].vnodeSelector, 'span.grid-previous.grid-page-link');
			assert.strictEqual(vnode.children![0].children![1].children![1].vnodeSelector, 'span.grid-pagination-links');
			assert.lengthOf(vnode.children![0].children![1].children![1].children, 5);
			// more asserts
			assert.strictEqual(vnode.children![0].children![1].children![2].vnodeSelector, 'span.grid-next.grid-page-link');
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
			assert.strictEqual(vnode.vnodeSelector, 'div.grid-footer');

			assert.strictEqual(vnode.children![0].vnodeSelector, 'div.grid-pagination');
			assert.lengthOf(vnode.children![0].children, 2);
			assert.strictEqual(vnode.children![0].children![0].vnodeSelector, 'div.grid-status');
			assert.strictEqual(vnode.children![0].children![0].text, '91 - 100 of 100 results');
			assert.strictEqual(vnode.children![0].children![1].vnodeSelector, 'div.grid-navigation');

			assert.lengthOf(vnode.children![0].children![1].children, 3);
			assert.strictEqual(vnode.children![0].children![1].children![0].vnodeSelector, 'span.grid-previous.grid-page-link');
			assert.strictEqual(vnode.children![0].children![1].children![1].vnodeSelector, 'span.grid-pagination-links');
			assert.lengthOf(vnode.children![0].children![1].children![1].children, 7);
			// more asserts
			assert.strictEqual(vnode.children![0].children![1].children![2].vnodeSelector, 'span.grid-next.grid-page-link');
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
			assert.strictEqual(vnode.vnodeSelector, 'div.grid-footer');

			assert.strictEqual(vnode.children![0].vnodeSelector, 'div.grid-pagination');
			assert.lengthOf(vnode.children![0].children, 2);
			assert.strictEqual(vnode.children![0].children![0].vnodeSelector, 'div.grid-status');
			assert.strictEqual(vnode.children![0].children![0].text, '51 - 60 of 100 results');
			assert.strictEqual(vnode.children![0].children![1].vnodeSelector, 'div.grid-navigation');

			assert.lengthOf(vnode.children![0].children![1].children, 3);
			assert.strictEqual(vnode.children![0].children![1].children![0].vnodeSelector, 'span.grid-previous.grid-page-link');
			assert.strictEqual(vnode.children![0].children![1].children![1].vnodeSelector, 'span.grid-pagination-links');
			assert.lengthOf(vnode.children![0].children![1].children![1].children, 9);
			// more asserts
			assert.strictEqual(vnode.children![0].children![1].children![2].vnodeSelector, 'span.grid-next.grid-page-link');
		}
	}
});
