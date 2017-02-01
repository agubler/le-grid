import { VNodeProperties } from '@dojo/interfaces/vdom';
import { Widget, WidgetMixin, WidgetProperties, WidgetFactory, DNode } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import registryMixin, { RegistryMixin, RegistryMixinProperties } from '@dojo/widget-core/mixins/registryMixin';
import themeable, { Themeable } from '@dojo/widget-core/mixins/themeable';
import { v, w } from '@dojo/widget-core/d';
import outerNodeTheme from './mixins/outerNodeTheme';
import { Column } from './createGrid';

import * as baseTheme1 from './styles/gridRow';

export interface GridRowProperties extends WidgetProperties, RegistryMixinProperties {
	columns: Column[];
	item: any;
}

export interface GridRowMixin extends WidgetMixin<GridRowProperties>, RegistryMixin { }

export type GridRow = Widget<GridRowProperties> & Themeable<typeof baseTheme1>

export interface GridRowFactory extends WidgetFactory<GridRowMixin, GridRowProperties> { }

const createGridRow: GridRowFactory = createWidgetBase
	.mixin(registryMixin)
	.mixin(themeable)
	.mixin(outerNodeTheme)
	.mixin({
		mixin: {
			baseTheme: baseTheme1,
			getOuterNodeThemes(this: GridRow): Object[] {
				return [ this.theme.gridRow || {} ];
			},
			nodeAttributes: [
				function(this: GridRow): VNodeProperties {
					return { role: 'row' };
				}
			],
			getChildrenNodes(this: GridRow): DNode[] {
				const { properties: { item, columns = [] } } = this;

				return [
					v('table', { classes: this.theme.gridRowTable, styles: { 'background-color': item.color } }, [
						v('tr', { classes: this.theme.gridRow, role: 'row' },
							columns.map(({ id, renderer }) => {
								return w('grid-cell', { key: id, data: item[id], renderer });
							})
						)
					])
				];
			}
		}
	});

export default createGridRow;
