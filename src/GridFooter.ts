import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { DNode } from '@dojo/widget-core/interfaces';
import { v } from '@dojo/widget-core/d';
import { PaginationDetails }  from './LeGrid';

import * as css from './styles/gridFooter.m.css';

export interface GridFooterProperties extends WidgetProperties, ThemeableProperties {
	onPaginationRequest(pageNumber: string): void;
	paginationDetails?: PaginationDetails;
	totalCount: number;
}

/**
 * create base const, work around for typescript issue https://github.com/Microsoft/TypeScript/issues/14017
 */
export const GridFooterBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class GridFooter extends GridFooterBase<GridFooterProperties> {
		onClick(evt: any) {
			this.properties.onPaginationRequest && this.properties.onPaginationRequest(evt.target.attributes['page'].value);
		}

		createPageLink(page: string, visable: boolean, disabled: boolean, extraClasses?: string, overrideLabel?: string): DNode {
			if (visable) {
				const classes = [css.pageLink];

				if (disabled) {
					classes.push(css.disabledPageLink);
				}
				if (extraClasses) {
					classes.push(extraClasses);
				}

				const properties = {
					key: page,
					classes: this.classes(...classes).get(),
					onclick: this.onClick, page
				};

				return v('span', properties, [ overrideLabel || page ]);
			}
			return null;
		}

		render(): DNode {
			const { properties: { totalCount, paginationDetails: { dataRangeStart = 0, dataRangeCount = Infinity } = {} } } = this;
			const totalPages = Math.ceil(totalCount / dataRangeCount);
			const pageNumber = dataRangeStart === 0 ? 1 : (dataRangeStart / dataRangeCount) + 1;

			return v('div', { classes: this.classes(css.footer).get() }, [
				dataRangeCount !== Infinity ? v('div', [
					v('div', { classes: this.classes(css.status).get() }, [ `${dataRangeStart + 1} - ${dataRangeStart + dataRangeCount} of ${totalCount} results` ]),
					v('div', { classes: this.classes(css.navigation).get() }, [
						this.createPageLink(String(pageNumber - 1), true, Boolean(pageNumber === 1), css.previousPage, '<'),
						v('span', [
							this.createPageLink('1', true, Boolean(pageNumber === 1)),
							pageNumber > 3 ? v('span', [ '...' ]) : null,
							this.createPageLink(String(pageNumber - 2), Boolean(pageNumber - 2 > 1), false),
							this.createPageLink(String(pageNumber - 1), Boolean(pageNumber - 1 > 1), false),
							this.createPageLink(String(pageNumber), Boolean(pageNumber !== 1 && pageNumber !== totalPages), true),
							this.createPageLink(String(pageNumber + 1), Boolean(pageNumber + 1 < totalPages), false),
							this.createPageLink(String(pageNumber + 2), Boolean(pageNumber + 2 < totalPages), false),
							pageNumber !== totalPages ? v('span', [ '...' ]) : null,
							this.createPageLink(String(totalPages), true, Boolean(pageNumber === totalPages))
						]),
						this.createPageLink(String(pageNumber + 1), true, Boolean(pageNumber === totalPages), css.nextPage, '>')
					])
				]) : v('div', { classes: this.classes(css.status).get() }, [ `${totalCount} results` ])
			]);
		}
}
