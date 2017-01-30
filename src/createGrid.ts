import { VNodeProperties } from '@dojo/interfaces/vdom';
import { Widget, WidgetMixin, WidgetProperties, WidgetFactory, DNode, PropertiesChangeEvent } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import themeable, { ThemeableMixin } from '@dojo/widget-core/mixins/themeable';
import { includes } from '@dojo/shim/array';
import { w } from '@dojo/widget-core/d';
import FactoryRegistry from '@dojo/widget-core/FactoryRegistry';

import outerNodeTheme from './mixins/outerNodeTheme';
import dataProviderMixin, { DataProviderMixinProperties, DataProviderMixin } from './mixins/dataProviderMixin';
import createBody from './createBody';
import createRow from './createRow';
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

export interface GridProperties extends WidgetProperties, DataProviderMixinProperties {
	columns: Column[];
	customCell?: any;
	pagination?: PaginatedProperties;
}

export interface GridMixin extends WidgetMixin<GridProperties>, ThemeableMixin<typeof baseTheme>  {
	onSortRequest(this: GridMixin, columnId: string, descending: boolean): void;
	onPaginationRequest(this: GridMixin, pageNumber: string): void;
}

export type Grid = Widget<GridProperties> & GridMixin & DataProviderMixin

export interface GridFactory extends WidgetFactory<Grid, GridProperties> { }

interface InternalState {
	sortDetails?: SortDetails;
	paginationDetails?: PaginationDetails;
}

const internalStateMap = new WeakMap<Grid, InternalState>();

const createGrid: GridFactory = createWidgetBase
	.mixin(themeable)
	.mixin(outerNodeTheme)
	.mixin(dataProviderMixin)
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
				const { properties: { dataProvider } } = this;
				const internalState = internalStateMap.get(this);

				internalState.sortDetails = { columnId, descending };
				dataProvider.sort({
					columnId,
					direction: descending ? 'desc' : 'asc'
				});
			},
			onPaginationRequest(this: Grid, pageNumber: string): void {
				const { properties: { dataProvider, pagination: { itemsPerPage } = { itemsPerPage: 10 } } } = this;
				const internalState = internalStateMap.get(this);
				const dataRangeStart = (parseInt(pageNumber, 10) - 1) * itemsPerPage;

				dataProvider.fetch({
					start: dataRangeStart,
					count: itemsPerPage
				});

				internalState.paginationDetails = { dataRangeStart, dataRangeCount: itemsPerPage, pageNumber: parseInt(pageNumber, 10)};
			},
			getChildrenNodes(this: Grid): DNode[] {
				const { data, properties: { dataProvider, columns, pagination }, registry } = this;
				const { paginationDetails, sortDetails } = internalStateMap.get(this);

				return [
					w('grid-header', { registry, onSortRequest: this.onSortRequest.bind(this), sortDetails, columns } ),
					w('grid-body', { registry, dataProvider, columns, items: data.items } ),
					w('grid-footer', { onPaginationRequest: this.onPaginationRequest.bind(this), totalCount: data.totalCount, paginationDetails, pagination: Boolean(pagination) } )
				];
			}
		},
		initialize(instance) {
			const { dataProvider, pagination } = <GridProperties> instance.properties;

			instance.registry = createRegistry(instance.properties);

			instance.own(instance.on('properties:changed', (evt: PropertiesChangeEvent<Grid, GridProperties>) => {
				if (includes(evt.changedPropertyKeys, 'customCell')) {
					instance.registry = createRegistry(evt.properties);
				}

				// TODO add changed of items per page
			}));

			if (pagination) {
				dataProvider.configure({ size: { start: 0, count: pagination.itemsPerPage }});
				internalStateMap.set(instance, { paginationDetails: { dataRangeStart: 0, dataRangeCount: pagination.itemsPerPage, pageNumber: 1 } });
			}
			else {
				internalStateMap.set(instance, {});
			}
		}
	});

export default createGrid;
