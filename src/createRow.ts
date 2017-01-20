import { VNodeProperties } from '@dojo/interfaces/vdom';
import { Widget, WidgetMixin, WidgetProperties, WidgetFactory, DNode } from '@dojo/widgets/interfaces';
import createWidgetBase from '@dojo/widgets/createWidgetBase';
import registryMixin, { RegistryMixin, RegistryMixinProperties } from '@dojo/widgets/mixins/registryMixin';
import externalState, { ExternalStateMixin, ExternalStateProperties } from '@dojo/widgets/mixins/externalState';
import { v, w } from '@dojo/widgets/d';

import { Column } from './createDgrid';

export interface DgridRowProperties extends ExternalStateProperties, WidgetProperties, RegistryMixinProperties {
	item: any;
	column: Column;
}

export interface DgridRowMixin extends WidgetMixin<DgridRowProperties>, ExternalStateMixin, RegistryMixin { }

export type DgridRow = Widget<DgridRowProperties>

export interface DgridRowFactory extends WidgetFactory<DgridRowMixin, DgridRowProperties> { }

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
				const { properties: { item, columns, registry } } = this;

				return [
					v('table.dgrid-row-table', { styles: { 'background-color': item.color } }, [
						w('dgrid-row-view', { registry, columns, item } )
					])
				];
			}
		}
	});

export default createDgridRow;
