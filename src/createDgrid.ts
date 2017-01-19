import { VNodeProperties } from '@dojo/interfaces/vdom';
import { Widget, WidgetProperties, WidgetFactory, DNode, PropertiesChangeEvent } from '@dojo/widgets/interfaces';
import createWidgetBase from '@dojo/widgets/createWidgetBase';
import { includes } from '@dojo/shim/array';
import createSort from '@dojo/stores/query/createSort';
import { w } from '@dojo/widgets/d';
import { QueryTransformMixin } from '@dojo/stores/store/mixins/createQueryTransformMixin';
import FactoryRegistry from '@dojo/widgets/FactoryRegistry';

import createBody from './createBody';
import createRow from './createRow';
import createRowView from './createRowView';
import createCell from './createCell';
import createHeader from './createHeader';
import createHeaderCell from './createHeaderCell';

const registry = new FactoryRegistry();
registry.define('dgrid-body', createBody);
registry.define('dgrid-row', createRow);
registry.define('dgrid-row-view', createRowView);
registry.define('dgrid-cell', createCell);
registry.define('dgrid-header', createHeader);
registry.define('dgrid-header-cell', createHeaderCell);

export interface Column {
	id: string;
	label: string;
	field?: string;
	sortable?: boolean;
	color?: string;
}

export interface SortDetails {
	[index: string]: boolean;
}

export interface DgridProperties extends WidgetProperties {
	columns: Column[];
	externalState: QueryTransformMixin<{}, any>;
}

export type Dgrid = Widget<DgridProperties> & {
	onRequestSort?(columnId: string, descending: boolean): void;
}

export interface DgridFactory extends WidgetFactory<Dgrid, DgridProperties> { }

interface InternalState {
	externalState: QueryTransformMixin<{}, any>;
	sortDetails: SortDetails;
}

const internalStateMap = new WeakMap<Dgrid, InternalState>();

const createDgrid: DgridFactory = createWidgetBase
	.mixin({
		mixin: {
			registry,
			classes: ['dgrid-widgets', 'dgrid', 'dgrid-grid'],
			nodeAttributes: [
				function(this: Dgrid): VNodeProperties {
					return {
						role: 'grid'
					};
				}
			],
			onRequestSort(columnId: string, descending: boolean): void {
				const externalState = this.properties.externalState.sort(createSort([ columnId ], [ descending ]));

				internalStateMap.set(this, { externalState, sortDetails: { [columnId]: descending }});
				this.invalidate();
			},
			getChildrenNodes(this: Dgrid): DNode[] {
				const { properties: { columns }, registry } = this;
				const { sortDetails, externalState } = internalStateMap.get(this);

				return [
					w('dgrid-header', { registry, onRequestSort: this.onRequestSort.bind(this), sortDetails, columns }),
					w('dgrid-body', { registry, externalState, columns })
				];
			}
		},
		initialize(instance) {
			const { properties: { externalState } } = instance;

			instance.own(instance.on('properties:changed', (evt: PropertiesChangeEvent<Dgrid, DgridProperties>) => {
				if (includes(evt.changedPropertyKeys, 'externalState')) {
					const internalState = internalStateMap.get(instance);

					internalState.externalState = evt.properties.externalState;
					internalStateMap.set(instance, internalState);
				}
			}));
			internalStateMap.set(instance, { externalState, sortDetails: {} });
		}
	});

export default createDgrid;
