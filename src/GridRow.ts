import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties, PropertyChangeRecord } from '@dojo/widget-core/interfaces';
import { RegistryMixin, RegistryMixinProperties } from '@dojo/widget-core/mixins/Registry';
import { ThemeableMixinInterface, ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { DNode } from '@dojo/widget-core/interfaces';
import { v, w } from '@dojo/widget-core/d';
import { Column } from './LeGrid';

import * as css from './styles/gridRow.css';

export interface GridRowProperties extends WidgetProperties, RegistryMixinProperties, ThemeableProperties {
	columns: Column[];
	item: any;
}

@theme(css)
export default class GridRow extends ThemeableMixin(RegistryMixin(WidgetBase))<GridRowProperties> implements ThemeableMixinInterface {
	diffPropertyItem(previousProperty: any, newProperty: any): PropertyChangeRecord {
		let changed = newProperty !== previousProperty;

		if (typeof newProperty.equals === 'function') {
			changed = !newProperty.equals(previousProperty);
		}

		return { changed, value: newProperty };
	}

	render(): DNode {
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
