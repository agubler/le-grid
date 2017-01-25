import { VNodeProperties } from '@dojo/interfaces/vdom';
import { Widget, WidgetMixin, WidgetProperties, WidgetFactory, DNode } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import registryMixin, { RegistryMixin, RegistryMixinProperties } from '@dojo/widget-core/mixins/registryMixin';
import storeMixin, { StoreMixinApi, StoreMixinProperties } from '@dojo/widget-core/mixins/storeMixin';
import { v, w } from '@dojo/widget-core/d';

import { Column } from './createDgrid';

export interface DgridRowProperties extends StoreMixinProperties, WidgetProperties, RegistryMixinProperties {
	item: any;
	columns: Column[];
}

export interface DgridRowMixin extends WidgetMixin<DgridRowProperties>, StoreMixinApi, RegistryMixin { }

export type DgridRow = Widget<DgridRowProperties>

export interface DgridRowFactory extends WidgetFactory<DgridRowMixin, DgridRowProperties> { }

const createDgridRow: DgridRowFactory = createWidgetBase
	.mixin(registryMixin)
	.mixin(storeMixin)
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
		},
		initialize(instance) {
			instance.own(instance.on('state:changed', () => {
				instance.invalidate();
			}));
		}
	});

export default createDgridRow;
