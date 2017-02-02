import { Widget, WidgetMixin, WidgetProperties, WidgetFactory, DNode } from '@dojo/widget-core/interfaces';
import registryMixin, { RegistryMixin, RegistryMixinProperties } from '@dojo/widget-core/mixins/registryMixin';
import themeable, { ThemeableMixin } from '@dojo/widget-core/mixins/themeable';
import { v, w } from '@dojo/widget-core/d';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { DataProviderMixinProperties } from './mixins/dataProviderMixin';
import { Column } from './createGrid';

import * as css from './styles/gridBody.css';

export interface GridBodyProperties extends WidgetProperties, RegistryMixinProperties, DataProviderMixinProperties {
	columns: Column[];
}

export interface GridBodyMixin extends WidgetMixin<GridBodyProperties>, RegistryMixin, ThemeableMixin {}

export type GridBody = Widget<GridBodyProperties> & GridBodyMixin

export interface GridBodyFactory extends WidgetFactory<GridBodyMixin, GridBodyProperties> { }

const createGridBody: GridBodyFactory = createWidgetBase
.mixin(registryMixin)
.mixin(themeable)
.mixin({
	mixin: {
		baseClasses: css,
		render(this: GridBody): DNode {
			const { properties: { items = [], dataProvider, columns, registry } } = this;

			return v('div', { classes: this.classes(css.scroller).get() }, [
				v('div', { classes: this.classes(css.content).get() }, items.map((item: any) => {
						const key = item.get ? item.get('id') : item.id;
						return w('grid-row', { key, id: key, item, columns, dataProvider, registry });
					})
				)
			]);
		}
	}
});

export default createGridBody;
