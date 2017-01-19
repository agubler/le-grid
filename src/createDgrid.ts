import { Widget, WidgetProperties, WidgetFactory, DNode, PropertiesChangeEvent } from '@dojo/widgets/interfaces';
import createWidgetBase from '@dojo/widgets/createWidgetBase';
import registryMixin, { RegistryMixinProperties } from '@dojo/widgets/mixins/registryMixin';
import internalState, { InternalState } from '@dojo/widgets/mixins/internalState';
import { includes } from '@dojo/shim/array';
import createSort from '@dojo/stores/query/createSort';
import { w, registry } from '@dojo/widgets/d';

import createBody from './createBody';
import createRow from './createRow';
import createCell from './createCell';
import createHeader from './createHeader';
import createHeaderCell from './createHeaderCell';

registry.define('dgrid-body', createBody);
registry.define('dgrid-row', createRow);
registry.define('dgrid-cell', createCell);
registry.define('dgrid-header', createHeader);
registry.define('dgrid-header-cell', createHeaderCell);

export interface Column {
	id: string;
	label: string;
	field?: string;
	sortable?: boolean;
}

export interface DgridProperties extends WidgetProperties, RegistryMixinProperties {
	columns: Column[];
	externalState: any;
}

export type Dgrid = Widget<DgridProperties> & InternalState;

export interface DgridFactory extends WidgetFactory<Dgrid, DgridProperties> { }

const createDgrid: DgridFactory = createWidgetBase
	.mixin(registryMixin)
	.mixin(internalState)
	.mixin({
		mixin: {
			classes: ['dgrid-widgets', 'dgrid', 'dgrid-grid'],
			nodeAttributes: [
				function(): any {
					return {
						role: 'grid'
					};
				}
			],
			getChildrenNodes(this: Dgrid): DNode[] {
				const { state: { externalState, sortedColumn = { } }, properties: { registry, columns } } = this;

				const sortData = (columnId: string, descending: boolean) => {
					const externalState = (<any> this.properties.externalState).sort(createSort([ columnId ], [ descending ]));

					this.setState({ externalState, sortedColumn: { [columnId]: descending } });
				};

				console.log(sortedColumn);

				return [
					w('dgrid-header', { registry, columns, sortData, sortedColumn }),
					w('dgrid-body', { registry, columns, externalState })
				];
			}
		},
		initialize(instance) {
			instance.own(instance.on('properties:changed', (evt: PropertiesChangeEvent<Dgrid, DgridProperties>) => {
				if (includes(evt.changedPropertyKeys, 'externalState')) {
					instance.setState({ externalState: evt.properties.externalState });
				}
			}));
			const { properties: { externalState } } = instance;
			instance.setState({ externalState });
		}
	});

export default createDgrid;
