import { Widget, WidgetProperties, WidgetFactory, DNode } from '@dojo/widgets/interfaces';
import createWidgetBase from '@dojo/widgets/createWidgetBase';
import registryMixin, { RegistryMixin, RegistryMixinProperties } from '@dojo/widgets/mixins/registryMixin';
import externalState, { ExternalStateMixin, ExternalStateProperties } from '@dojo/widgets/mixins/externalState';
import { v, w } from '@dojo/widgets/d';
import { Column } from './createDgrid';

export interface DgridBodyProperties extends WidgetProperties, RegistryMixinProperties, ExternalStateProperties {
	columns: Column[];
}

export type DgridBody = Widget<DgridBodyProperties> & ExternalStateMixin & RegistryMixin

export interface DgridBodyFactory extends WidgetFactory<DgridBody, DgridBodyProperties> { }

const createDgridBody: DgridBodyFactory = createWidgetBase
.mixin(registryMixin)
.mixin(externalState)
.mixin({
	mixin: {
		classes: [ 'dgrid-scroller' ],
		getChildrenNodes(this: DgridBody): DNode[] {
			const { state: { afterAll: items = [] }, properties: { externalState, columns, registry } } = this;

			return [ v('div.dgrid-content', items.map((item: any) => {
					return w('dgrid-row', { id: item.id, item, columns, externalState, registry });
				}))
			];
		}
	}
});


export default createDgridBody;
