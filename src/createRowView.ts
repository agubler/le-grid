import { VNodeProperties } from '@dojo/interfaces/vdom';
import { Widget, WidgetMixin, WidgetProperties, WidgetFactory, DNode } from '@dojo/widgets/interfaces';
import createWidgetBase from '@dojo/widgets/createWidgetBase';
import registryMixin, { RegistryMixin, RegistryMixinProperties } from '@dojo/widgets/mixins/registryMixin';
import { w } from '@dojo/widgets/d';

import { Column } from './createDgrid';

export interface DgridRowViewProperties extends WidgetProperties, RegistryMixinProperties {
	item: any;
	columns: Column[];
}

export interface DgridRowViewMixin extends WidgetMixin<DgridRowViewProperties>, RegistryMixin { }

export type DgridRowView = Widget<DgridRowViewProperties>

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
				const { properties: { item, columns = [] } } = this;

				return columns.map(({ id, renderer }) => {
					return w('dgrid-cell', { id, data: item[id], renderer });
				});
			}
		}
	});

export default createDgridRowView;
