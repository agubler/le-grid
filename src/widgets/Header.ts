import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import ThemedMixin, { theme } from '@dojo/widget-core/mixins/Themed';
import { ColumnConfig, FilterOptions, SortOptions } from './../interfaces';
import { DNode } from '@dojo/widget-core/interfaces';

import * as css from './styles/Header.m.css';

export interface HeaderProperties {
	columnConfig: ColumnConfig[];
	sorter: (columnId: string, direction: 'asc' | 'desc') => void;
	filterer: (columnId: string, value: any) => void;
	filter?: FilterOptions;
	sort?: SortOptions;
}

@theme(css)
export default class Header extends ThemedMixin(WidgetBase)<HeaderProperties> {
	protected render(): DNode {
		const { columnConfig, sorter, sort, filterer } = this.properties;
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
					let headerProperties = {};
					if (column.sortable) {
						headerProperties = {
							classes: [sort && sort.columnId === column.id ? css.sorted : null],
							onclick: () => {
								const direction = sort
									? sort.columnId !== column.id ? 'desc' : sort.direction === 'desc' ? 'asc' : 'desc'
									: 'desc';
								sorter(column.id, direction);
							}
						};
					}

					return v('div', { classes: css.cell }, [
						v('div', headerProperties, [title]),
						column.filterable
							? v('input', {
									classes: css.filter,
									oninput: (event: KeyboardEvent) => {
										const target = event.target as HTMLInputElement;
										filterer(column.id, target.value);
									}
								})
							: null
					]);
				})
			)
		]);
	}
}
