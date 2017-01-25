import { VNodeProperties } from '@dojo/interfaces/vdom';
import { Widget, WidgetMixin, WidgetProperties, WidgetFactory, DNode, PropertiesChangeEvent } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import themeable, { ThemeableMixin } from '@dojo/widget-core/mixins/themeable';
import { includes } from '@dojo/shim/array';
import createSort from '@dojo/stores/query/createSort';
import { w } from '@dojo/widget-core/d';
import { QueryTransformMixin } from '@dojo/stores/store/mixins/createQueryTransformMixin';
import storeMixin from '@dojo/widget-core/mixins/storeMixin';
import FactoryRegistry from '@dojo/widget-core/FactoryRegistry';
import outerNodeTheme from './mixins/outerNodeTheme';
import createBody from './createBody';
import createRow from './createRow';
import createRowView from './createRowView';
import createCell from './createCell';
import createHeader from './createHeader';
import createHeaderCell from './createHeaderCell';
import createFooter from './createFooter';

import * as baseTheme from './styles/grid';

function createRegistry(props: any) {
	const { customCell } = props;
	const registry = new FactoryRegistry();
	registry.define('grid-body', createBody);
	registry.define('grid-row', createRow);
	registry.define('grid-row-view', createRowView);
	registry.define('grid-cell', customCell || createCell);
	registry.define('grid-header', createHeader);
	registry.define('grid-header-cell', createHeaderCell);
	registry.define('grid-footer', createFooter);
	return registry;
}

export interface Column {
	id: string;
	label: string;
	field?: string;
	sortable?: boolean;
	color?: string;
	renderer?: (value: string) => string;
}

export interface SortDetails {
	columnId: string;
	descending: boolean;
}

export interface PaginationDetails {
	dataRangeStart: number;
	dataRangeCount: number;
	pageNumber: number;
}

export interface PaginatedProperties {
	itemsPerPage: number;
}

export interface GridProperties extends WidgetProperties {
	columns: Column[];
	store: QueryTransformMixin<{}, any>;
	customCell?: any;
	pagination?: PaginatedProperties;
}

export interface GridMixin extends WidgetMixin<GridProperties>, ThemeableMixin<typeof baseTheme>  {
	onSortRequest(this: GridMixin, columnId: string, descending: boolean): void;
	onPaginationRequest(this: GridMixin, pageNumber: string): void;
}

export type Grid = Widget<GridProperties> & GridMixin

export interface GridFactory extends WidgetFactory<Grid, GridProperties> { }

interface InternalState {
	store: QueryTransformMixin<{}, any>;
	sortDetails?: SortDetails;
	paginationDetails?: PaginationDetails;
}

const internalStateMap = new WeakMap<Grid, InternalState>();

const defaultPaginationDetails: PaginationDetails  = {
	dataRangeStart: 0,
	dataRangeCount: 10,
	pageNumber: 1
};

const createGrid: GridFactory = createWidgetBase
	.mixin(themeable)
	.mixin(outerNodeTheme)
	.mixin(storeMixin)
	.mixin({
		mixin: {
			baseTheme,
			getOuterNodeThemes(this: Grid): Object[] {
				return [ this.theme.grid || {} ];
			},
			nodeAttributes: [
				function(this: Grid, attributes: VNodeProperties): VNodeProperties {
					return { role: 'grid' };
				}
			],
			onSortRequest(this: Grid, columnId: string, descending: boolean): void {
				const { pagination, store } = <GridProperties> this.properties;
				const internalState = internalStateMap.get(this);

				internalState.store = store.sort(createSort([ columnId ], [ descending ]));

				if (pagination) {
					const { paginationDetails: { dataRangeStart, dataRangeCount } = defaultPaginationDetails } = internalState;
					internalState.store = internalState.store.range(dataRangeStart, dataRangeCount);
				}

				internalState.sortDetails = { columnId, descending };
				this.invalidate();
			},
			onPaginationRequest(this: Grid, pageNumber: string): void {
				const { pagination: { itemsPerPage = 10 } = { }, store } = <GridProperties> this.properties;
				const internalState = internalStateMap.get(this);
				const dataRangeStart = (parseInt(pageNumber, 10) - 1) * itemsPerPage;

				if (internalState.sortDetails) {
					internalState.store = store
						.sort(createSort(internalState.sortDetails.columnId, internalState.sortDetails.descending))
						.range(dataRangeStart, itemsPerPage);
				}
				else {
					internalState.store = store.range(dataRangeStart, itemsPerPage);
				}

				internalState.paginationDetails = { dataRangeStart, dataRangeCount: itemsPerPage, pageNumber: parseInt(pageNumber, 10)};
				this.invalidate();
			},
			getChildrenNodes(this: Grid): DNode[] {
				const { state: { data = [] }, properties: { columns, pagination }, registry } = this;
				const { paginationDetails, sortDetails, store } = internalStateMap.get(this);

				return [
					w('grid-header', { registry, onSortRequest: this.onSortRequest.bind(this), sortDetails, columns } ),
					w('grid-body', { registry, store, columns } ),
					w('grid-footer', { onPaginationRequest: this.onPaginationRequest.bind(this), totalCount: data.length, paginationDetails, pagination: Boolean(pagination) } )
				];
			}
		},
		initialize(instance) {
			const { store, pagination } = <GridProperties> instance.properties;

			instance.registry = createRegistry(instance.properties);

			instance.own(instance.on('properties:changed', (evt: PropertiesChangeEvent<Grid, GridProperties>) => {
				if (includes(evt.changedPropertyKeys, 'store')) {
					const internalState = internalStateMap.get(instance);

					internalState.store = evt.properties.store;
					internalStateMap.set(instance, internalState);
				}

				if (includes(evt.changedPropertyKeys, 'customCell')) {
					instance.registry = createRegistry(evt.properties);
				}

				// TODO add changed of items per page
			}));

			if (pagination) {
				internalStateMap.set(instance, {
					store: store.range(0, pagination.itemsPerPage),
					paginationDetails: { dataRangeStart: 0, dataRangeCount: pagination.itemsPerPage, pageNumber: 1 }
				});
			}
			else {
				internalStateMap.set(instance, { store });
			}

		}
	});

export default createGrid;
