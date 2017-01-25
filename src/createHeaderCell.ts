import { VNodeProperties } from '@dojo/interfaces/vdom';
import { Widget, WidgetMixin, WidgetProperties, WidgetFactory, DNode } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { assign } from '@dojo/core/lang';
import { v } from '@dojo/widget-core/d';

import { Column, SortDetails } from './createDgrid';

export interface DgridHeaderProperties extends WidgetProperties {
	onSortRequest(columnId: string, descending: boolean): void;
	sortDetails?: SortDetails;
	column: Column;
	id: string;
}

export interface DgridHeaderMixin extends WidgetMixin<DgridHeaderProperties> {
	onSortRequest(event: any): void;
}

export type DgridHeader = Widget<DgridHeaderProperties> & DgridHeaderMixin

export interface DgridHeaderFactory extends WidgetFactory<DgridHeader, DgridHeaderProperties> { }

const createDgridHeader: DgridHeaderFactory = createWidgetBase
	.mixin({
		mixin: {
			tagName: 'th',
			classes: ['dgrid-cell'],
			onSortRequest(this: DgridHeader, event: MouseEvent): void {
				const { id, sortDetails: { descending = false } = {} } = <DgridHeaderProperties> this.properties;
				this.properties.onSortRequest && this.properties.onSortRequest(id, !descending);
			},
			nodeAttributes: [
				function(this: DgridHeader, attributes: VNodeProperties): VNodeProperties {
					const { id, sortDetails, column } = <DgridHeaderProperties> this.properties;

					const classes = sortDetails ? {
						'dgrid-sort-up': sortDetails.descending,
						'dgrid-sort-down': !sortDetails.descending
					} : {};

					const onclick = column.sortable ? { onclick: this.onSortRequest } : {};

					return assign({ classes, role: 'columnheader' }, onclick);
				}
			],
			getChildrenNodes(this: DgridHeader): DNode[] {
				const { id, column, sortDetails } = <DgridHeaderProperties> this.properties;
				return [
					v('span', [ column.label ]),
					sortDetails && sortDetails.columnId === id ? v('div.dgrid-sort-arrow.ui-icon', { role: 'presentation' }) : null
				];
			}
		}
	});

export default createDgridHeader;
