import { Widget, WidgetMixin, WidgetProperties, WidgetFactory, DNode } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import themeable, { ThemeableMixin } from '@dojo/widget-core/mixins/themeable';
import outerNodeTheme from './mixins/outerNodeTheme';

import * as baseTheme from './styles/gridCell';

export interface GridCellProperties extends WidgetProperties {
	data: string;
}

export interface GridCellMixin extends WidgetMixin<GridCellProperties>, ThemeableMixin<typeof baseTheme> { }

export type GridCell = Widget<GridCellProperties> & GridCellMixin

export interface GridCellFactory extends WidgetFactory<GridCellMixin, GridCellProperties> { }

const createGridCell: GridCellFactory = createWidgetBase
	.mixin(themeable)
	.mixin(outerNodeTheme)
	.mixin({
		mixin: {
			tagName: 'td',
			baseTheme,
			getOuterNodeThemes(this: GridCell): Object[] {
				return [ this.theme.cell || {} ];
			},
			getChildrenNodes(this: GridCell): DNode[] {
				const { properties: { data, renderer } } = this;
				const value = renderer ? renderer(data) : data;
				return [ value ? value.toString() : null ];
			}
		}
	});

export default createGridCell;
