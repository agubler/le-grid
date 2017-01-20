import { VNodeProperties } from '@dojo/interfaces/vdom';
import { Widget, WidgetMixin, WidgetProperties, WidgetFactory, DNode } from '@dojo/widgets/interfaces';
import createWidgetBase from '@dojo/widgets/createWidgetBase';
import registryMixin, { RegistryMixin, RegistryMixinProperties }  from '@dojo/widgets/mixins/registryMixin';
import { v } from '@dojo/widgets/d';

import { Column, SortDetails } from './createDgrid';

export interface DgridHeaderProperties extends WidgetProperties, RegistryMixinProperties {
	onSortRequest(columnId: string, descending: boolean): void;
	sortDetails: SortDetails;
	column: Column;
	id: string;
}

export interface DgridHeaderMixin extends WidgetMixin<DgridHeaderProperties>, RegistryMixin {
	onSortRequest(event: any): void;
}

export type DgridHeader = Widget<DgridHeaderProperties> & DgridHeaderMixin

export interface DgridHeaderFactory extends WidgetFactory<DgridHeader, DgridHeaderProperties> { }

const createDgridHeader: DgridHeaderFactory = createWidgetBase
	.mixin(registryMixin)
	.mixin({
		mixin: {
			tagName: 'th',
			classes: ['dgrid-cell'],
			onSortRequest(this: DgridHeader, event: MouseEvent): void {
				const { id, sortDetails: { descending = false } = { } } = <DgridHeaderProperties> this.properties;
				this.properties.onSortRequest && this.properties.onSortRequest(id, !descending);
			},
			nodeAttributes: [
				function(this: DgridHeader, attributes: VNodeProperties): VNodeProperties {
					const { id, sortDetails } = <DgridHeaderProperties> this.properties;

					const classes = sortDetails ? {
						'dgrid-sort-up': sortDetails.descending,
						'dgrid-sort-down': !sortDetails.descending
					} : {};

					return { classes, onclick: this.onSortRequest, role: 'columnheader' };
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
