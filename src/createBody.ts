import { Widget, WidgetProperties, WidgetFactory, DNode } from '@dojo/widgets/interfaces';
import createWidgetBase from '@dojo/widgets/createWidgetBase';
import registryMixin, { Registry, RegistryMixinProperties } from '@dojo/widgets/mixins/registryMixin';
import externalState, { ExternalState, ExternalStateProperties } from '@dojo/widgets/mixins/externalState';
import { v, w, registry } from '@dojo/widgets/d';

export interface DgridBodyProperties extends WidgetProperties, RegistryMixinProperties, ExternalStateProperties {
	items: any[];
}

export type DgridBody = Widget<DgridBodyProperties> & ExternalState & Registry;

export interface DgridBodyFactory extends WidgetFactory<DgridBody, DgridBodyProperties> { }

const createDgridBody: DgridBodyFactory = createWidgetBase
.mixin(registryMixin)
.mixin(externalState)
.mixin({
	mixin: {
		classes: [ 'dgrid-scroller' ],
		getChildrenNodes(this: DgridBody): DNode[] {
			const { state: { afterAll: items = <any[]> [] }, registry, properties: { externalState, columns } } = this;

			this.state['afterAll'] && console.log((<any> this.state['afterAll']).length, this.state);


			return [ v('div.dgrid-content', items.map((item: any) => {
					return w('dgrid-row', { id: item.id, item, columns, externalState, registry });
				}))
			];
		}
	}
	});

export default createDgridBody;
