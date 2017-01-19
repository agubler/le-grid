import { VNodeProperties } from '@dojo/interfaces/vdom';
import { Widget, WidgetProperties, WidgetFactory, DNode } from '@dojo/widgets/interfaces';
import createWidgetBase from '@dojo/widgets/createWidgetBase';
import registryMixin, { RegistryMixin, RegistryMixinProperties } from '@dojo/widgets/mixins/registryMixin';
import externalState, { ExternalStateMixin, ExternalStateProperties } from '@dojo/widgets/mixins/externalState';
import { v, w } from '@dojo/widgets/d';

import { Column } from './createDgrid';

export interface DgridRowProperties extends ExternalStateProperties, WidgetProperties, RegistryMixinProperties {
	item: any;
	column: Column;
}

export type DgridRow = Widget<DgridRowProperties> & ExternalStateMixin & RegistryMixin

export interface DgridRowFactory extends WidgetFactory<DgridRow, DgridRowProperties> { }

const createDgridRow: DgridRowFactory = createWidgetBase
	.mixin(registryMixin)
	.mixin(externalState)
	.mixin({
		mixin: {
			classes: [ 'dgrid-row' ],
			nodeAttributes: [
				function(this: DgridRow): VNodeProperties {
					return { role: 'row' };
				}
			],
			getChildrenNodes(this: DgridRow): DNode[] {
				const { properties: { item, columns } } = this;

				return [
					v('table.dgrid-row-table', { styles: { 'background-color': item.color } }, [
						w('dgrid-row-view', { columns, item } )
					])
				];
			}
		}
	});

export default createDgridRow;
