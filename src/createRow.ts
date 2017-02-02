import { Widget, WidgetMixin, WidgetProperties, WidgetFactory, DNode, PropertyChangeRecord } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import registryMixin, { RegistryMixin, RegistryMixinProperties } from '@dojo/widget-core/mixins/registryMixin';
import themeable, { Themeable } from '@dojo/widget-core/mixins/themeable';
import { v, w } from '@dojo/widget-core/d';
import { Column } from './createGrid';

import * as css from './styles/gridRow.css';

export interface GridRowProperties extends WidgetProperties, RegistryMixinProperties {
	columns: Column[];
	item: any;
}

export interface GridRowMixin extends WidgetMixin<GridRowProperties>, RegistryMixin { }

export type GridRow = Widget<GridRowProperties> & Themeable

export interface GridRowFactory extends WidgetFactory<GridRowMixin, GridRowProperties> { }

const createGridRow: GridRowFactory = createWidgetBase
	.mixin(registryMixin)
	.mixin(themeable)
	.mixin({
		mixin: {
			baseClasses: css,
			diffPropertyItem(this: GridRow, previousProperty: any, newProperty: any): PropertyChangeRecord {
				let changed;
				if (typeof newProperty.equals === 'function') {
					changed = !newProperty.equals(previousProperty);
				}
				else {
					changed = newProperty !== previousProperty;
				}

				return {
					changed,
					value: newProperty
				};
			},
			render(this: GridRow): DNode {
				const { properties: { columns = [] } } = this;
				const item = this.properties.item.get ? this.properties.item.toObject() : this.properties.item;

				return v('div', { classes: this.classes(css.gridRow).get(), role: 'row' }, [
					v('table', { classes: this.classes(css.gridRowTable).get(), styles: { 'background-color': item.color } }, [
						v('tr', { classes: this.classes(css.gridRow).get(), role: 'row' },
							columns.map(({ id, renderer }) => {
								return w('grid-cell', { key: id, data: item[id], renderer });
							})
						)
					])
				]);
			}
		}
	});

export default createGridRow;
