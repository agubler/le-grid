import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import ThemedMixin, { theme } from '@dojo/widget-core/mixins/Themed';
import { ColumnConfig } from './../interfaces';
import { DNode } from '@dojo/widget-core/interfaces';

import * as css from './styles/Header.m.css';

export interface HeaderProperties {
	columnConfig: ColumnConfig[];
}

@theme(css)
export default class Header extends ThemedMixin(WidgetBase)<HeaderProperties> {
	protected render(): DNode {
		const { columnConfig } = this.properties;
		return v('div', { classes: css.root }, [
			v(
				'div',
				{ classes: css.row },
				columnConfig.map((column) => {
					let title: string | DNode;
					if (typeof column.title === 'function') {
						title = column.title();
					} else {
						title = column.title;
					}
					return v('div', { classes: css.cell }, [title]);
				})
			)
		]);
	}
}
