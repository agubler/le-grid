import { VNodeProperties } from '@dojo/interfaces/vdom';
import { Widget, WidgetMixin, WidgetProperties, WidgetFactory } from '@dojo/widgets/interfaces';
import createWidgetBase from '@dojo/widgets/createWidgetBase';
import registryMixin, { RegistryMixin, RegistryMixinProperties }  from '@dojo/widgets/mixins/registryMixin';
import { v } from '@dojo/widgets/d';

import { Column, SortDetails } from './createDgrid';

export interface DgridFooterProperties extends WidgetProperties, RegistryMixinProperties {
	onSortRequest(columnId: string, descending: boolean): void;
	onPaginationRequest(pageNumber: string): void;
	columns: Column[];
	sortDetails: SortDetails;
}

export interface DgridFooterMixin extends WidgetMixin<DgridFooterProperties>, RegistryMixin {
	onClick(this: DgridFooter, evt: MouseEvent): void;
}

export type DgridFooter = Widget<DgridFooterProperties> & DgridFooterMixin

export interface DgridFooterFactory extends WidgetFactory<DgridFooter, DgridFooterProperties> { }

const createDgridFooter: DgridFooterFactory = createWidgetBase
.mixin(registryMixin)
.mixin({
	mixin: {
		tagName: 'div',
		classes: [ 'dgrid-footer' ],
		onClick(this: DgridFooter, evt: any) {
			this.properties.onPaginationRequest && this.properties.onPaginationRequest(evt.target.attributes['page'].value);
		},
		getChildrenNodes(this: DgridFooter): VNodeProperties {
			const { properties: { totalCount = '?', pagination, paginationDetails: { dataRangeStart = 0, dataRangeCount = 0, pageNumber = 1 } = {} } } = this;

			return [
				pagination ? v('div.dgrid-pagination', [
					v('div.dgrid-status', [ `${dataRangeStart + 1} - ${dataRangeStart + dataRangeCount} of ${totalCount} results` ]),
					v('div.dgrid-navigation', [
						v('span.dgrid-previous.dgrid-page-link', { onclick: this.onClick, page: String(pageNumber - 1), classes: { 'dgrid-page-disabled': (pageNumber === 1) } }, [ '<' ]),
						v('span.dgrid-pagination-links', [
							v('span.dgrid-page-link', { onclick: this.onClick, page: '1', classes: { 'dgrid-page-disabled': pageNumber === 1 } }, [ '1' ]),
							v('span.dgrid-page-skip', [ '...' ]),
							v('span.dgrid-page-link', { onclick: this.onClick, page: String(pageNumber + 1), classes: { 'dgrid-page-disabled': 1 !== 1 } }, [ String(pageNumber + 1) ]),
							v('span.dgrid-page-link', { onclick: this.onClick, page: String(pageNumber + 2), classes: { 'dgrid-page-disabled': 1 !== 1 } }, [ String(pageNumber + 2) ]),
							v('span.dgrid-page-skip', [ '...' ]),
							v('span.dgrid-page-link', { onclick: this.onClick, page: '4', classes: { 'dgrid-page-disabled': 1 === 1 } }, [ '4' ])
						]),
						v('span.dgrid-next.dgrid-page-link', { onclick: this.onClick, page: String(pageNumber + 1), classes: { 'dgrid-page-disabled': ((1 * 10) >= 100) } }, [ '>' ])
					])
				]) : null
			];
		}
	}
});

export default createDgridFooter;
