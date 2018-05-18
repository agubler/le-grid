import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import ThemedMixin, { theme } from '@dojo/widget-core/mixins/Themed';
import { DNode } from '@dojo/widget-core/interfaces';
import uuid from '@dojo/core/uuid';

import * as css from './Cell.m.css';

export interface CellProperties {
	value: string | DNode;
	updater: Function;
}

@theme(css)
export default class Cell extends ThemedMixin(WidgetBase)<CellProperties> {
	protected render(): DNode {
		return v(
			'div',
			{
				classes: css.root,
				onclick: () => {
					this.properties.updater(this.properties.key, uuid().substr(0, 8));
				}
			},
			[this.properties.value]
		);
	}
}
