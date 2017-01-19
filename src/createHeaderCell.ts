import { VNodeProperties } from '@dojo/interfaces/vdom';
import { Widget, WidgetProperties, WidgetFactory, DNode } from '@dojo/widgets/interfaces';
import createWidgetBase from '@dojo/widgets/createWidgetBase';
import registryMixin, { RegistryMixinProperties }  from '@dojo/widgets/mixins/registryMixin';
import { v } from '@dojo/widgets/d';

export interface DgridHeaderProperties extends WidgetProperties, RegistryMixinProperties {
	sort(columnId: string, descending: boolean): void;
	sortedColumn: { [index: string]: boolean; };
}

export type DgridHeader = Widget<DgridHeaderProperties> & {
	sort(event: any): void;
}

export interface DgridHeaderFactory extends WidgetFactory<DgridHeader, DgridHeaderProperties> { }

const createDgridHeader: DgridHeaderFactory = createWidgetBase
	.mixin(registryMixin)
	.mixin({
		mixin: {
			tagName: 'th',
			classes: ['dgrid-cell'],
			sort(this: DgridHeader, event: any): void {
				this.properties.sort && this.properties.sort(this.properties.id, !this.properties.sortedColumn[this.properties.id]);
			},
			nodeAttributes: [
				function(this: DgridHeader): VNodeProperties {
					const { properties: { id, column, sortedColumn} } = this;
					const sorted = sortedColumn[id] !== null && sortedColumn[id] !== undefined;

					return {
						classes: {
							'dgrid-sort-up': sorted && sortedColumn[id] === false,
							'dgrid-sort-down': sorted && sortedColumn[id] === true
						},
						onclick: this.sort,
						role: 'columnheader',
						sortable: column.sortable,
						field: column.field,
						columnId: column.id
					};
				}
			],
			getChildrenNodes(this: DgridHeader): DNode[] {
				const { properties: { id, column, sortedColumn = { } } } = this;
				const sorted = sortedColumn[id] !== null && sortedColumn[id] !== undefined;
				return [
					v('span', [ column.label ]),
					sorted ? v('div.dgrid-sort-arrow.ui-icon', { role: 'presentation' }) : null
				];
			}
		}
	});

export default createDgridHeader;
