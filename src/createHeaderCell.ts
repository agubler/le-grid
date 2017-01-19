import { VNodeProperties } from '@dojo/interfaces/vdom';
import { Widget, WidgetProperties, WidgetFactory, DNode } from '@dojo/widgets/interfaces';
import createWidgetBase from '@dojo/widgets/createWidgetBase';
import registryMixin, { RegistryMixinProperties }  from '@dojo/widgets/mixins/registryMixin';
import { v } from '@dojo/widgets/d';

import { Column, SortDetails } from './createDgrid';

export interface DgridHeaderProperties extends WidgetProperties, RegistryMixinProperties {
	onRequestSort(columnId: string, descending: boolean): void;
	sortDetails: SortDetails;
	column: Column;
}

export type DgridHeader = Widget<DgridHeaderProperties> & {
	onRequestSort(event: any): void;
}

export interface DgridHeaderFactory extends WidgetFactory<DgridHeader, DgridHeaderProperties> { }

const createDgridHeader: DgridHeaderFactory = createWidgetBase
	.mixin(registryMixin)
	.mixin({
		mixin: {
			tagName: 'th',
			classes: ['dgrid-cell'],
			onRequestSort(this: DgridHeader, event: MouseEvent): void {
				this.properties.onRequestSort && this.properties.onRequestSort(this.properties.id, !this.properties.sortDetails[this.properties.id]);
			},
			nodeAttributes: [
				function(this: DgridHeader): VNodeProperties {
					const { properties: { id, sortDetails} } = this;
					const sorted = sortDetails[id] !== null && sortDetails[id] !== undefined;

					return {
						classes: {
							'dgrid-sort-up': sorted && sortDetails[id] === false,
							'dgrid-sort-down': sorted && sortDetails[id] === true
						},
						onclick: this.onRequestSort,
						role: 'columnheader'
					};
				}
			],
			getChildrenNodes(this: DgridHeader): DNode[] {
				const { properties: { id, column, sortDetails } } = this;
				const sorted = sortDetails[id] !== null && sortDetails[id] !== undefined;
				return [
					v('span', [ column.label ]),
					sorted ? v('div.dgrid-sort-arrow.ui-icon', { role: 'presentation' }) : null
				];
			}
		}
	});

export default createDgridHeader;
