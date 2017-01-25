import { Widget, WidgetMixin, WidgetProperties, WidgetFactory, DNode } from '@dojo/widget-core/interfaces';
import registryMixin, { RegistryMixin, RegistryMixinProperties } from '@dojo/widget-core/mixins/registryMixin';
import storeMixin, { StoreMixinApi, StoreMixinProperties } from '@dojo/widget-core/mixins/storeMixin';
import themeable, { ThemeableMixin } from '@dojo/widget-core/mixins/themeable';
import { v, w } from '@dojo/widget-core/d';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import outerNodeTheme from './mixins/outerNodeTheme';
import { Column } from './createGrid';

import * as baseTheme from './styles/gridBody';

export interface GridBodyProperties extends WidgetProperties, RegistryMixinProperties, StoreMixinProperties {
	columns: Column[];
}

export interface GridBodyMixin extends WidgetMixin<GridBodyProperties>, StoreMixinApi, RegistryMixin, ThemeableMixin<typeof baseTheme> {}

export type GridBody = Widget<GridBodyProperties> & GridBodyMixin

export interface GridBodyFactory extends WidgetFactory<GridBodyMixin, GridBodyProperties> { }

const createGridBody: GridBodyFactory = createWidgetBase
.mixin(registryMixin)
.mixin(storeMixin)
.mixin(themeable)
.mixin(outerNodeTheme)
.mixin({
	mixin: {
		baseTheme,
		getOuterNodeThemes(this: GridBody): Object[] {
			return [ this.theme.scroller || {} ];
		},
		getChildrenNodes(this: GridBody): DNode[] {
			const { state: { data = [] }, properties: { store, columns, registry } } = this;

			return [ v('div', { classes: this.theme.content }, data.map((item: any) =>
				w('grid-row', { key: item.id, id: item.id, item, columns, store, registry })
			))];
		}
	}
});

export default createGridBody;
