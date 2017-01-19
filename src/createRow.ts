import { VNodeProperties } from '@dojo/interfaces/vdom';
import { Widget, WidgetProperties, WidgetFactory, DNode } from '@dojo/widgets/interfaces';
import createWidgetBase from '@dojo/widgets/createWidgetBase';
import registryMixin, { RegistryMixinProperties } from '@dojo/widgets/mixins/registryMixin';
import externalState, { ExternalStateProperties } from '@dojo/widgets/mixins/externalState';
import { v, w } from '@dojo/widgets/d';

export interface DgridRowProperties extends ExternalStateProperties, WidgetProperties, RegistryMixinProperties {
	id: string;
}

export type DgridRow = Widget<DgridRowProperties>

export interface DgridRowFactory extends WidgetFactory<DgridRow, DgridRowProperties> { }

const createDgridRow: DgridRowFactory = createWidgetBase
	.mixin(registryMixin)
	.mixin(externalState)
	.mixin({
		mixin: {
			classes: [ 'dgrid-row' ],
			nodeAttributes: [
				function(): VNodeProperties {
					return {
						role: 'row'
					};
				}
			],
			getChildrenNodes(this: DgridRow): DNode[] {
				const { properties: { item, columns } } = this;

				return [
					v('table.dgrid-row-table', [
						v('tr', columns.map((column: { id: string }) => {
							return w('dgrid-cell', { id: column.id, data: item[column.id] });
						}))
					])
				];
			}
		}
	});

export default createDgridRow;
