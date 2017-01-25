import { VNodeProperties } from '@dojo/interfaces/vdom';
import { Widget, WidgetMixin, WidgetProperties, WidgetFactory, DNode } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import themeable, { ThemeableMixin } from '@dojo/widget-core/mixins/themeable';
import { v } from '@dojo/widget-core/d';
import { PaginationDetails, PaginatedProperties }  from './createGrid';
import outerNodeTheme from './mixins/outerNodeTheme';

import * as baseTheme1 from './styles/gridFooter';

export interface GridFooterProperties extends WidgetProperties {
	onPaginationRequest(pageNumber: string): void;
	paginationDetails?: PaginationDetails;
	pagination?: PaginatedProperties;
	totalCount: number;
}

export interface GridFooterMixin extends WidgetMixin<GridFooterProperties>, ThemeableMixin<typeof baseTheme1> {
	onClick(this: GridFooter, evt: MouseEvent): void;
	createPageLink(this: GridFooter, page: string, visable: boolean, disabled: boolean): DNode;
}

export type GridFooter = Widget<GridFooterProperties> & GridFooterMixin

export interface GridFooterFactory extends WidgetFactory<GridFooterMixin, GridFooterProperties> { }

const createGridFooter: GridFooterFactory = createWidgetBase
.mixin(themeable)
.mixin(outerNodeTheme)
.mixin({
	mixin: {
		baseTheme: baseTheme1,
		getOuterNodeThemes(this: GridFooter): Object[] {
			return [ this.theme.footer || {} ];
		},
		onClick(this: GridFooter, evt: any) {
			this.properties.onPaginationRequest && this.properties.onPaginationRequest(evt.target.attributes['page'].value);
		},
		createPageLink(this: GridFooter, page: string, visable: boolean, disabled: boolean): DNode {
			if (visable) {
				// TODO this wont work now
				/*const classes = {
					'grid-page-disabled': disabled
				};*/
				return v('span', { key: page, classes: this.theme.pageLink,  onclick: this.onClick, page }, [ page ]);
			}
			return null;
		},
		getChildrenNodes(this: GridFooter): VNodeProperties {
			const { properties: { totalCount, pagination, paginationDetails: { dataRangeStart = 0, dataRangeCount = 10, pageNumber = 1 } = {} } } = this;
			const totalPages = Math.ceil(totalCount / dataRangeCount);

			return [
				pagination ? v('div', [
					v('div', { classes: this.theme.status }, [ `${dataRangeStart + 1} - ${dataRangeStart + dataRangeCount} of ${totalCount} results` ]),
					v('div', { classes: this.theme.navigation }, [
						v('span', { onclick: this.onClick, page: String(pageNumber - 1), classes: { ...this.theme.pageLink, ...this.theme.previousPage } }, [ '<' ]),
						v('span', [
							v('span', { onclick: this.onClick, page: '1', classes: this.theme.pageLink } , [ '1' ]),
							pageNumber > 3 ? v('span', [ '...' ]) : null,
							this.createPageLink(String(pageNumber - 2), Boolean(pageNumber - 2 > 1), false),
							this.createPageLink(String(pageNumber - 1), Boolean(pageNumber - 1 > 1), false),
							this.createPageLink(String(pageNumber), Boolean(pageNumber !== 1 && pageNumber !== totalPages), true),
							this.createPageLink(String(pageNumber + 1), Boolean(pageNumber + 1 < totalPages), false),
							this.createPageLink(String(pageNumber + 2), Boolean(pageNumber + 2 < totalPages), false),
							pageNumber !== totalPages ? v('span', [ '...' ]) : null,
							v('span', { onclick: this.onClick, page: String(totalPages), classes: this.theme.pageLink }, [ String(totalPages) ])
						]),
						v('span', { onclick: this.onClick, page: String(pageNumber + 1), classes: { ...this.theme.pageLink, ...this.theme.nextPage } }, [ '>' ])
					])
				]) : v('div', { classes: this.theme.status }, [ `${totalCount} results` ])
			];
		}
	}
});

export default createGridFooter;
