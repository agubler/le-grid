import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';

import ThemedMixin, { theme } from '@dojo/widget-core/mixins/Themed';
import { ColumnConfig } from './interfaces';

import Cell from './Cell';
import * as css from './Row.m.css';
import { DNode } from '@dojo/widget-core/interfaces';

export interface RowProperties {
	item: { [index: string]: any } | false;
	height: number;
	columnConfig: ColumnConfig[];
	updater?: Function;
}

@theme(css)
export default class Row extends ThemedMixin(WidgetBase)<RowProperties> {
	private _updater(column: string, value: string) {
		this.properties.updater && this.properties.updater(this.properties.key, column, value);
	}

	protected render(): DNode {
		const { height, item, columnConfig } = this.properties;
		if (item === false) {
			return v('div', { styles: { height: `${height}px` }, classes: [css.root] }, ['loading']);
		}
		let columns = columnConfig.reduce(
			(cols, config) => {
				let value: string | DNode = item[config.id];
				if (config.renderer) {
					value = config.renderer({ value });
				}
				cols.push(w(Cell, { key: config.id, value, updater: this._updater }));
				return cols;
			},
			[] as DNode[]
		);

		return v('div', { styles: { height: `${height}px` }, classes: css.root }, columns);
	}
}
