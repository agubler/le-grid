import { Widget, WidgetMixin, WidgetProperties, WidgetFactory, DNode } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import themeable, { ThemeableMixin } from '@dojo/widget-core/mixins/themeable';
import { v } from '@dojo/widget-core/d';
import { Column, SortDetails } from './createLeGrid';

import * as css from './styles/gridHeaderCell.css';

export interface GridHeaderProperties extends WidgetProperties {
	onSortRequest(columnId: string, descending: boolean): void;
	sortDetails?: SortDetails;
	column: Column;
	id: string;
}

export interface GridHeaderMixin extends WidgetMixin<GridHeaderProperties>, ThemeableMixin {
	onSortRequest(event: any): void;
}

export type GridHeader = Widget<GridHeaderProperties> & GridHeaderMixin

export interface GridHeaderFactory extends WidgetFactory<GridHeader, GridHeaderProperties> { }

const createGridHeader: GridHeaderFactory = createWidgetBase
	.mixin(themeable)
	.mixin({
		mixin: {
			baseClasses: css,
			onSortRequest(this: GridHeader, event: MouseEvent): void {
				const { id, sortDetails: { descending = false } = {} } = <GridHeaderProperties> this.properties;
				this.properties.onSortRequest && this.properties.onSortRequest(id, !descending);
			},
			render(this: GridHeader): DNode {
				const { id, column, sortDetails } = <GridHeaderProperties> this.properties;
				const classes = [css.sortArrow, css.icon];
				if (sortDetails && sortDetails.descending) {
					classes.push(css.sortUp);
				}
				const onclick = column.sortable ? { onclick: this.onSortRequest } : {};

				return v('th', { ...onclick, ...{ classes: this.classes(css.cell).get(), role: 'columnheader' } }, [
					v('span', [ column.label ]),
					sortDetails && sortDetails.columnId === id ?
						v('div', { classes: this.classes(...classes).get(), role: 'presentation' }) :
						null
				]);
			}
		}
	});

export default createGridHeader;
