import { Widget, WidgetMixin, WidgetProperties, WidgetFactory, DNode } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import registryMixin, { RegistryMixin, RegistryMixinProperties }  from '@dojo/widget-core/mixins/registryMixin';
import { v, w } from '@dojo/widget-core/d';
import themeable, { ThemeableMixin } from '@dojo/widget-core/mixins/themeable';
import { Column, SortDetails } from './createLeGrid';

import * as css from './styles/gridHeader.css';

export interface GridHeaderProperties extends WidgetProperties, RegistryMixinProperties {
	onSortRequest(columnId: string, descending: boolean): void;
	columns: Column[];
	sortDetails?: SortDetails;
}

export interface GridHeaderMixin extends WidgetMixin<GridHeaderProperties>, RegistryMixin, ThemeableMixin { }

export type GridHeader = Widget<GridHeaderProperties> & GridHeaderMixin

export interface GridHeaderFactory extends WidgetFactory<GridHeader, GridHeaderProperties> { }

const createGridHeader: GridHeaderFactory = createWidgetBase
	.mixin(themeable)
	.mixin(registryMixin)
	.mixin({
		mixin: {
			baseClasses: css,
			render(this: GridHeader): DNode {
				const { properties: { onSortRequest, columns = [], sortDetails } } = this;

				return v('div', { role: 'row', classes: this.classes(css.gridHeaderRow, css.gridHeader).get() }, [
					v('table', { classes: this.classes(css.gridHeaderTable).get(), role: 'presentation' }, [
						v('tr', columns.map((column) => {
							return w('grid-header-cell', { id: column.id, key: column.id, column, sortDetails, onSortRequest });
						}))
					])
				]);
			}
		}
	});

export default createGridHeader;
