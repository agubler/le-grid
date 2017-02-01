import { Widget, WidgetMixin, WidgetProperties, WidgetFactory, DNode } from '@dojo/widget-core/interfaces';
import registryMixin, { RegistryMixin, RegistryMixinProperties } from '@dojo/widget-core/mixins/registryMixin';
import themeable, { ThemeableMixin } from '@dojo/widget-core/mixins/themeable';
import { v, w } from '@dojo/widget-core/d';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { DataProviderMixinProperties } from './mixins/dataProviderMixin';
import { Column } from './createGrid';

import css from './styles/gridBody';

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

			return v('div', { classes: this.classes(css.classes.scroller).get() }, [
			v('div', { classes: this.classes(css.classes.content).get() }, items.map((item: any) =>
				w('grid-row', { key: item.id, id: item.id, item, columns, dataProvider, registry })
			))]);
		}
	}
});

export default createGridBody;
