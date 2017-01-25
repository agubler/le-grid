import { Widget, WidgetMixin, WidgetProperties, WidgetFactory, DNode } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import registryMixin, { RegistryMixin, RegistryMixinProperties } from '@dojo/widget-core/mixins/registryMixin';
import storeMixin, { StoreMixinApi, StoreMixinProperties } from '@dojo/widget-core/mixins/storeMixin';
import { v, w } from '@dojo/widget-core/d';
import { Column } from './createDgrid';

export interface DgridBodyProperties extends WidgetProperties, RegistryMixinProperties, StoreMixinProperties {
	columns: Column[];
}

export interface DgridBodyMixin extends WidgetMixin<DgridBodyProperties>, StoreMixinApi, RegistryMixin {}

export type DgridBody = Widget<DgridBodyProperties> & DgridBodyMixin

export interface DgridBodyFactory extends WidgetFactory<DgridBodyMixin, DgridBodyProperties> { }

const createDgridBody: DgridBodyFactory = createWidgetBase
.mixin(registryMixin)
.mixin(storeMixin)
.mixin({
	mixin: {
		classes: [ 'dgrid-scroller' ],
		getChildrenNodes(this: DgridBody): DNode[] {
			const { state: { data = [] }, properties: { store, columns, registry } } = this;

			return [ v('div.dgrid-content', data.map((item: any) => w('dgrid-row', { key: item.id, id: item.id, item, columns, store, registry }))) ];
		}
	}
});

export default createDgridBody;
