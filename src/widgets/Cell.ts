import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import ThemedMixin, { theme } from '@dojo/widget-core/mixins/Themed';
import { DNode } from '@dojo/widget-core/interfaces';

import * as css from './styles/Cell.m.css';

export interface CellProperties {
	value: string | DNode;
}

@theme(css)
export default class Cell extends ThemedMixin(WidgetBase)<CellProperties> {
	protected render(): DNode {
		let { value } = this.properties;
		return v('div', { classes: css.root }, [value]);
	}
}
