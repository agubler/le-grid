import { VNodeProperties } from '@dojo/interfaces/vdom';
import { Widget, WidgetMixin, WidgetProperties, WidgetFactory, DNode } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { v } from '@dojo/widget-core/d';

import { PaginationDetails, PaginatedProperties }  from './createDgrid';

export interface DgridFooterProperties extends WidgetProperties {
	onPaginationRequest(pageNumber: string): void;
	paginationDetails?: PaginationDetails;
	pagination?: PaginatedProperties;
	totalCount: number;
}

export interface DgridFooterMixin extends WidgetMixin<DgridFooterProperties> {
	onClick(this: DgridFooter, evt: MouseEvent): void;
	createPageLink(this: DgridFooter, page: string, visable: boolean, disabled: boolean): DNode;
}

export type DgridFooter = Widget<DgridFooterProperties> & DgridFooterMixin

export interface DgridFooterFactory extends WidgetFactory<DgridFooter, DgridFooterProperties> { }

const createDgridFooter: DgridFooterFactory = createWidgetBase
.mixin({
	mixin: {
		tagName: 'div',
		classes: [ 'dgrid-footer' ],
		onClick(this: DgridFooter, evt: any) {
			this.properties.onPaginationRequest && this.properties.onPaginationRequest(evt.target.attributes['page'].value);
		},
		createPageLink(this: DgridFooter, page: string, visable: boolean, disabled: boolean): DNode {
			if (visable) {
				const classes = {
					'dgrid-page-disabled': disabled
				};
				return v('span.dgrid-page-link', { onclick: this.onClick, page, classes }, [ page ]);
			}
			return null;
		},
		getChildrenNodes(this: DgridFooter): VNodeProperties {
			const { properties: { totalCount, pagination, paginationDetails: { dataRangeStart = 0, dataRangeCount = 10, pageNumber = 1 } = {} } } = this;
			const totalPages = Math.ceil(totalCount / dataRangeCount);

			return [
				pagination ? v('div.dgrid-pagination', [
					v('div.dgrid-status', [ `${dataRangeStart + 1} - ${dataRangeStart + dataRangeCount} of ${totalCount} results` ]),
					v('div.dgrid-navigation', [
						v('span.dgrid-previous.dgrid-page-link', { onclick: this.onClick, page: String(pageNumber - 1), classes: { 'dgrid-page-disabled': (pageNumber === 1) } }, [ '<' ]),
						v('span.dgrid-pagination-links', [
							v('span.dgrid-page-link', { onclick: this.onClick, page: '1', classes: { 'dgrid-page-disabled': pageNumber === 1 } }, [ '1' ]),
							pageNumber > 3 ? v('span.dgrid-page-skip', [ '...' ]) : null,
							this.createPageLink(String(pageNumber - 2), Boolean(pageNumber - 2 > 1), false),
							this.createPageLink(String(pageNumber - 1), Boolean(pageNumber - 1 > 1), false),
							this.createPageLink(String(pageNumber), Boolean(pageNumber !== 1 && pageNumber !== totalPages), true),
							this.createPageLink(String(pageNumber + 1), Boolean(pageNumber + 1 < totalPages), false),
							this.createPageLink(String(pageNumber + 2), Boolean(pageNumber + 2 < totalPages), false),
							pageNumber !== totalPages ? v('span.dgrid-page-skip', [ '...' ]) : null,
							v('span.dgrid-page-link', { onclick: this.onClick, page: String(totalPages), classes: { 'dgrid-page-disabled': pageNumber === totalPages } }, [ String(totalPages) ])
						]),
						v('span.dgrid-next.dgrid-page-link', { onclick: this.onClick, page: String(pageNumber + 1), classes: { 'dgrid-page-disabled': ((pageNumber * dataRangeCount) >= totalCount) } }, [ '>' ])
					])
				]) : v('div.dgrid-status', [ `${totalCount} results` ])
			];
		}
	}
});

export default createDgridFooter;
