import { VNodeProperties } from '@dojo/interfaces/vdom';
import { Widget, WidgetMixin, WidgetProperties, WidgetFactory, DNode } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import registryMixin, { RegistryMixin, RegistryMixinProperties } from '@dojo/widget-core/mixins/registryMixin';
import themeable, { Themeable } from '@dojo/widget-core/mixins/themeable';
import { w } from '@dojo/widget-core/d';
import outerNodeTheme from './mixins/outerNodeTheme';
import { Column } from './createGrid';

import * as baseTheme from './styles/gridRow';

export interface GridRowViewProperties extends WidgetProperties, RegistryMixinProperties {
	item: any;
	columns: Column[];
}

export interface GridRowViewMixin extends WidgetMixin<GridRowViewProperties>, RegistryMixin { }

export type GridRowView = Widget<GridRowViewProperties> & Themeable<typeof baseTheme>

export interface GridRowViewFactory extends WidgetFactory<GridRowViewMixin, GridRowViewProperties> { }

const createGridRowView: GridRowViewFactory = createWidgetBase
	.mixin(registryMixin)
	.mixin(themeable)
	.mixin(outerNodeTheme)
	.mixin({
		mixin: {
			tagName: 'tr',
			baseTheme,
			getOuterNodeThemes(this: GridRowView): Object[] {
				return [ this.theme.gridRow || {} ];
			},
			nodeAttributes: [
				function(this: GridRowView): VNodeProperties {
					return { role: 'row' };
				}
			],
			getChildrenNodes(this: GridRowView): DNode[] {
				const { properties: { item, columns = [] } } = this;

				return columns.map(({ id, renderer }) => {
					return w('grid-cell', { key: id, data: item[id], renderer });
				});
			}
		}
	});

export default createGridRowView;
