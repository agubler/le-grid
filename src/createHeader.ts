import { VNodeProperties } from '@dojo/interfaces/vdom';
import { Widget, WidgetMixin, WidgetProperties, WidgetFactory, DNode } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import registryMixin, { RegistryMixin, RegistryMixinProperties }  from '@dojo/widget-core/mixins/registryMixin';
import { v, w } from '@dojo/widget-core/d';
import themeable, { ThemeableMixin } from '@dojo/widget-core/mixins/themeable';
import outerNodeTheme from './mixins/outerNodeTheme';
import { Column, SortDetails } from './createGrid';

import * as baseTheme from './styles/gridHeader';

export interface GridHeaderProperties extends WidgetProperties, RegistryMixinProperties {
	onSortRequest(columnId: string, descending: boolean): void;
	columns: Column[];
	sortDetails?: SortDetails;
}

export interface GridHeaderMixin extends WidgetMixin<GridHeaderProperties>, RegistryMixin, ThemeableMixin<typeof baseTheme> { }

export type GridHeader = Widget<GridHeaderProperties> & GridHeaderMixin

export interface GridHeaderFactory extends WidgetFactory<GridHeader, GridHeaderProperties> { }

const createGridHeader: GridHeaderFactory = createWidgetBase
	.mixin(themeable)
	.mixin(outerNodeTheme)
	.mixin(registryMixin)
	.mixin({
		mixin: {
			baseTheme,
			getOuterNodeThemes(this: GridHeader): Object[] {
				return [ this.theme.gridHeaderRow || {}, this.theme.gridHeader || {} ];
			},
			nodeAttributes: [
				function(this: GridHeader): VNodeProperties {
					return { role: 'row' };
				}
			],
			getChildrenNodes(this: GridHeader): DNode[] {
				const { properties: { onSortRequest, columns = [], sortDetails } } = this;

				return [
					v('table', { classes: this.theme.gridHeaderTable, role: 'presentation' }, [
						v('tr', columns.map((column) => {
							return w('grid-header-cell', { id: column.id, key: column.id, column, sortDetails, onSortRequest });
						}))
					])
				];
			}
		}
	});

export default createGridHeader;
