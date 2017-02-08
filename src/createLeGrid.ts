import { Widget, WidgetMixin, WidgetProperties, WidgetFactory, DNode, PropertiesChangeEvent } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import themeable, { ThemeableMixin } from '@dojo/widget-core/mixins/themeable';
import { includes } from '@dojo/shim/array';
import { w, v } from '@dojo/widget-core/d';
import FactoryRegistry from '@dojo/widget-core/FactoryRegistry';

import dataProviderMixin, { DataProviderMixinProperties, DataProviderMixin } from './mixins/dataProviderMixin';
import createBody from './createBody';
import createRow from './createRow';
import createCell from './createCell';
import createHeader from './createHeader';
import createHeaderCell from './createHeaderCell';
import createFooter from './createFooter';

import * as css from './styles/grid.css';

function createRegistry(props: any) {
	const { customCell } = props;
	const registry = new FactoryRegistry();
	registry.define('grid-body', createBody);
	registry.define('grid-row', createRow);
	registry.define('grid-cell', customCell ? customCell() : createCell);
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
}

export interface PaginatedProperties {
	itemsPerPage: number;
}

export interface GridProperties extends WidgetProperties, DataProviderMixinProperties {
	columns: Column[];
	customCell?: any;
	pagination?: PaginatedProperties;
}

export interface GridMixin extends WidgetMixin<GridProperties>, ThemeableMixin  {
	onSortRequest(this: GridMixin, columnId: string, descending: boolean): void;
	onPaginationRequest(this: GridMixin, pageNumber: string): void;
}

export type Grid = Widget<GridProperties> & GridMixin & DataProviderMixin

export interface GridFactory extends WidgetFactory<Grid, GridProperties> { }

interface InternalState {
	sortDetails?: SortDetails;
	paginationDetails: PaginationDetails;
}

const internalStateMap = new WeakMap<Grid, InternalState>();

const createGrid: GridFactory = createWidgetBase
	.mixin(themeable)
	.mixin(dataProviderMixin)
	.mixin({
		mixin: {
			baseClasses: css,
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
				const { properties: { dataProvider } } = this;
				const internalState = internalStateMap.get(this);
				const { paginationDetails: { dataRangeCount } } = internalState;
				const dataRangeStart = (parseInt(pageNumber, 10) - 1) * dataRangeCount;

				dataProvider.fetch({
					start: dataRangeStart,
					count: dataRangeCount
				});

				internalState.paginationDetails = { dataRangeStart, dataRangeCount };
			},
			render(this: Grid): DNode {
				const { data: { items, totalCount }, properties: { dataProvider, columns }, registry } = this;
				const { paginationDetails, sortDetails } = internalStateMap.get(this);

				return v('div', { classes: this.classes(css.grid).get(), role: 'grid' }, [
					w('grid-header', { registry, onSortRequest: this.onSortRequest.bind(this), sortDetails, columns } ),
					w('grid-body', { registry, dataProvider, columns, items } ),
					w('grid-footer', { onPaginationRequest: this.onPaginationRequest.bind(this), totalCount, paginationDetails } )
				]);
			}
		},
		initialize(instance) {
			const { dataProvider, pagination } = <GridProperties> instance.properties;

			instance.registry = createRegistry(instance.properties);

			instance.own(instance.on('properties:changed', (evt: PropertiesChangeEvent<Grid, GridProperties>) => {
				if (includes(evt.changedPropertyKeys, 'customCell')) {
					instance.registry = createRegistry(evt.properties);
				}

				if (includes(evt.changedPropertyKeys, 'pagination')) {
					const internalState = internalStateMap.get(instance);

					internalState.paginationDetails.dataRangeCount = evt.properties!.pagination!.itemsPerPage;
					internalStateMap.set(instance, internalState);
				}

				// TODO add changed of items per page
			}));

			if (pagination) {
				dataProvider.configure({ size: { start: 0, count: pagination.itemsPerPage }});
				internalStateMap.set(instance, { paginationDetails: { dataRangeStart: 0, dataRangeCount: pagination.itemsPerPage } });
			}
			else {
				internalStateMap.set(instance, { paginationDetails: { dataRangeStart: 0, dataRangeCount: Infinity } });
			}
		}
	});

export default createGrid;
