import { VNodeProperties } from '@dojo/interfaces/vdom';
import { Widget, WidgetProperties, WidgetFactory, DNode } from '@dojo/widgets/interfaces';
import createWidgetBase from '@dojo/widgets/createWidgetBase';
import registryMixin, { RegistryMixinProperties }  from '@dojo/widgets/mixins/registryMixin';
import { v, w } from '@dojo/widgets/d';

export interface DgridHeaderProperties extends WidgetProperties, RegistryMixinProperties {
	sortData?(columnId: string, descending: boolean): void;
}

export type DgridHeader = Widget<DgridHeaderProperties> & { }

export interface DgridHeaderFactory extends WidgetFactory<DgridHeader, DgridHeaderProperties> { }

const createDgridHeader: DgridHeaderFactory = createWidgetBase
	.mixin(registryMixin)
	.mixin({
		mixin: {
			classes: ['dgrid-header', 'dgrid-header-row'],
			nodeAttributes: [
				function(): VNodeProperties {
					return {
						role: 'row'
					};
				}
			],
			getChildrenNodes(this: DgridHeader): DNode[] {
				const { properties: { sortData, columns = [], sortedColumn = { } } } = this;
				return [
					v('table.dgrid-row-table', { role: 'presentation' }, [
						v('tr', columns.map((column: any) => {
							return w('dgrid-header-cell', { id: column.id, column, sortedColumn, sort: sortData });
						}))
					])
				];
			}
		}
	});

export default createDgridHeader;
