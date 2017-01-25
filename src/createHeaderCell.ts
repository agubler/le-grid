import { VNodeProperties } from '@dojo/interfaces/vdom';
import { Widget, WidgetMixin, WidgetProperties, WidgetFactory, DNode } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import themeable, { ThemeableMixin } from '@dojo/widget-core/mixins/themeable';
import { assign } from '@dojo/core/lang';
import { v } from '@dojo/widget-core/d';
import outerNodeTheme from './mixins/outerNodeTheme';
import { Column, SortDetails } from './createGrid';

import * as baseTheme from './styles/gridHeaderCell';

export interface GridHeaderProperties extends WidgetProperties {
	onSortRequest(columnId: string, descending: boolean): void;
	sortDetails?: SortDetails;
	column: Column;
	id: string;
}

export interface GridHeaderMixin extends WidgetMixin<GridHeaderProperties>, ThemeableMixin<typeof baseTheme> {
	onSortRequest(event: any): void;
}

export type GridHeader = Widget<GridHeaderProperties> & GridHeaderMixin

export interface GridHeaderFactory extends WidgetFactory<GridHeader, GridHeaderProperties> { }

const createGridHeader: GridHeaderFactory = createWidgetBase
	.mixin(themeable)
	.mixin(outerNodeTheme)
	.mixin({
		mixin: {
			tagName: 'th',
			baseTheme,
			getOuterNodeThemes(this: GridHeader): Object[] {
				return [ this.theme.cell || {} ];
			},
			onSortRequest(this: GridHeader, event: MouseEvent): void {
				const { id, sortDetails: { descending = false } = {} } = <GridHeaderProperties> this.properties;
				this.properties.onSortRequest && this.properties.onSortRequest(id, !descending);
			},
			nodeAttributes: [
				function(this: GridHeader, attributes: VNodeProperties): VNodeProperties {
					const { id, sortDetails, column } = <GridHeaderProperties> this.properties;

					// TODO won't work anymore
					const classes = sortDetails ? {
						'grid-sort-up': sortDetails.descending,
						'grid-sort-down': !sortDetails.descending
					} : {};

					const onclick = column.sortable ? { onclick: this.onSortRequest } : {};

					return assign({ classes, role: 'columnheader' }, onclick);
				}
			],
			getChildrenNodes(this: GridHeader): DNode[] {
				const { id, column, sortDetails } = <GridHeaderProperties> this.properties;
				return [
					v('span', [ column.label ]),
					sortDetails && sortDetails.columnId === id ? v('div', { classes: { ...this.theme.sortArrow, ...this.theme.icon }, role: 'presentation' }) : null
				];
			}
		}
	});

export default createGridHeader;
