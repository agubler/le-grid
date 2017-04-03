import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { RegistryMixin, RegistryMixinProperties } from '@dojo/widget-core/mixins/Registry';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v, w } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import { Column } from './LeGrid';

import * as css from './styles/gridBody.m.css';

export interface GridBodyProperties extends WidgetProperties, RegistryMixinProperties, ThemeableProperties {
	columns: Column[];
	items: any[];
}

/**
 * create base const, work around for typescript issue https://github.com/Microsoft/TypeScript/issues/14017
 */
export const GridBodyBase = ThemeableMixin(RegistryMixin(WidgetBase));

@theme(css)
export default class GridBody extends GridBodyBase<GridBodyProperties> {
		render(): DNode {
			const { properties: { items = [], columns, registry } } = this;

			return v('div', { classes: this.classes(css.scroller).get() }, [
				v('div', { classes: this.classes(css.content).get() }, items.map((item: any) => {
						const key = item.get ? item.get('id') : item.id;
						return w('grid-row', { key, id: key, item, columns, registry });
					})
				)
			]);
		}
}
