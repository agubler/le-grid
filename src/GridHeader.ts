import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { RegistryMixin, RegistryMixinProperties }  from '@dojo/widget-core/mixins/Registry';
import { v, w } from '@dojo/widget-core/d';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { DNode } from '@dojo/widget-core/interfaces';
import { Column, SortDetails } from './LeGrid';

import * as css from './styles/gridHeader.m.css';

export interface GridHeaderProperties extends WidgetProperties, ThemeableProperties, RegistryMixinProperties {
	onSortRequest(columnId: string, descending: boolean): void;
	columns: Column[];
	sortDetails?: SortDetails;
}

/**
 * create base const, work around for typescript issue https://github.com/Microsoft/TypeScript/issues/14017
 */
export const GridHeaderBase = ThemeableMixin(RegistryMixin(WidgetBase));

@theme(css)
export default class GridHeader extends GridHeaderBase<GridHeaderProperties> {
	render(): DNode {
		const { properties: { onSortRequest, columns, sortDetails } } = this;

		return v('div', { role: 'row', classes: this.classes(css.gridHeaderRow, css.gridHeader).get() }, [
			v('table', { classes: this.classes(css.gridHeaderTable).get(), role: 'presentation' }, [
				v('tr', columns.map((column) => {
					return w('grid-header-cell', { id: column.id, key: column.id, column, sortDetails, onSortRequest });
				}))
			])
		]);
	}
}
