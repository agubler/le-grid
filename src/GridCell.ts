import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { v } from '@dojo/widget-core/d';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';

import * as css from './styles/gridCell.css';

export interface GridCellProperties extends WidgetProperties, ThemeableProperties {
	data: any;
	renderer?: Function;
}

@theme(css)
export default class GridCell extends ThemeableMixin(WidgetBase)<GridCellProperties> {
	render() {
		const { properties: { data, renderer } } = this;
		const value = renderer ? renderer(data) : data;
		return v('td', { classes: this.classes(css.cell).get() }, [ value ? value.toString() : null ]);
	}
}
