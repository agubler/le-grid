import { Widget, WidgetMixin, WidgetProperties, WidgetFactory, DNode } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { v } from '@dojo/widget-core/d';
import themeable, { ThemeableMixin } from '@dojo/widget-core/mixins/themeable';

import * as css from './styles/gridCell.css';

export interface GridCellProperties extends WidgetProperties {
	data: string;
}

export interface GridCellMixin extends WidgetMixin<GridCellProperties>, ThemeableMixin { }

export type GridCell = Widget<GridCellProperties> & GridCellMixin

export interface GridCellFactory extends WidgetFactory<GridCellMixin, GridCellProperties> { }

const createGridCell: GridCellFactory = createWidgetBase
	.mixin(themeable)
	.mixin({
		mixin: {
			baseClasses: css,
			render(this: GridCell): DNode {
				const { properties: { data, renderer } } = this;
				const value = renderer ? renderer(data) : data;
				return v('td', { classes: this.classes(css.cell).get() }, [ value ? value.toString() : null ]);
			}
		}
	});

export default createGridCell;
