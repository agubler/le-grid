import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { RegistryMixin, RegistryMixinProperties }  from '@dojo/widget-core/mixins/Registry';
import { v, w } from '@dojo/widget-core/d';
import { ThemeableMixinInterface, ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { DNode } from '@dojo/widget-core/interfaces';
import { Column, SortDetails } from './LeGrid';

import * as css from './styles/gridHeader.css';

export interface GridHeaderProperties extends WidgetProperties, ThemeableProperties, RegistryMixinProperties {
	onSortRequest(columnId: string, descending: boolean): void;
	columns: Column[];
	sortDetails?: SortDetails;
}

@theme(css)
export default class GridHeader extends ThemeableMixin(RegistryMixin(WidgetBase))<GridHeaderProperties> implements ThemeableMixinInterface {
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
