import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { v } from '@dojo/widget-core/d';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { DNode } from '@dojo/widget-core/interfaces';

import * as css from './styles/gridCell.css';

export interface GridCellProperties extends WidgetProperties, ThemeableProperties {
	data: any;
	renderer?: Function;
}

/**
 * create base const, work around for typescript issue https://github.com/Microsoft/TypeScript/issues/14017
 */
export const GridCellBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class GridCell extends GridCellBase<GridCellProperties> {
	render(): DNode {
		const { properties: { data, renderer } } = this;
		const value = renderer ? renderer(data) : data;
		return v('td', { classes: this.classes(css.cell).get() }, [ value ? value.toString() : null ]);
	}
}
