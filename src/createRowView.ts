import { VNodeProperties } from '@dojo/interfaces/vdom';
import { Widget, WidgetProperties, WidgetFactory, DNode } from '@dojo/widgets/interfaces';
import createWidgetBase from '@dojo/widgets/createWidgetBase';
import registryMixin, { RegistryMixin, RegistryMixinProperties } from '@dojo/widgets/mixins/registryMixin';
import { v, w } from '@dojo/widgets/d';

import { Column } from './createDgrid';

export interface DgridRowViewProperties extends WidgetProperties, RegistryMixinProperties {
	item: any;
	column: Column;
}

export type DgridRowView = Widget<DgridRowViewProperties> & RegistryMixin;

export interface DgridRowViewFactory extends WidgetFactory<DgridRowView, DgridRowViewProperties> { }

const createDgridRowView: DgridRowViewFactory = createWidgetBase
	.mixin(registryMixin)
	.mixin({
		mixin: {
			tagName: 'tr',
			classes: [ 'dgrid-row' ],
			nodeAttributes: [
				function(this: DgridRowView): VNodeProperties {
					return { role: 'row' };
				}
			],
			getChildrenNodes(this: DgridRowView): DNode[] {
				const { properties: { item, columns } } = this;

				return columns.map((column: { id: string }) => {
					return w('dgrid-cell', { id: column.id, data: item[column.id] });
				});
			}
		}
	});

export default createDgridRowView;
