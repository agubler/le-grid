import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties, PropertiesChangeEvent } from '@dojo/widget-core/interfaces';
import { ThemeableMixinInterface, ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { DNode } from '@dojo/widget-core/interfaces';
import { includes } from '@dojo/shim/array';
import { w, v } from '@dojo/widget-core/d';
import FactoryRegistry from '@dojo/widget-core/FactoryRegistry';

import { DataProviderMixinProperties, DataProviderMixin } from './mixins/DataProvider';
import GridBody from './GridBody';
import GridRow from './GridRow';
import GridCell from './GridCell';
import GridHeader from './GridHeader';
import GridHeaderCell from './GridHeaderCell';
import GridFooter from './GridFooter';

import * as css from './styles/grid.css';

function createRegistry(props: any) {
	const { customCell } = props;
	const registry = new FactoryRegistry();
	registry.define('grid-body', GridBody);
	registry.define('grid-row', GridRow);
	registry.define('grid-cell', customCell ? customCell() : GridCell);
	registry.define('grid-header', GridHeader);
	registry.define('grid-header-cell', GridHeaderCell);
	registry.define('grid-footer', GridFooter);
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

export interface GridProperties extends WidgetProperties, DataProviderMixinProperties, ThemeableProperties {
	columns: Column[];
	customCell?: any;
	pagination?: PaginatedProperties;
}

interface InternalState {
	sortDetails?: SortDetails;
	paginationDetails: PaginationDetails;
}

/**
 * create base const, work around for typescript issue https://github.com/Microsoft/TypeScript/issues/14017
 */
export const LeGridBase = DataProviderMixin(ThemeableMixin(WidgetBase));

@theme(css)
export default class LeGrid extends LeGridBase<GridProperties> implements ThemeableMixinInterface {

	private sortDetails: SortDetails;
	private paginationDetails: PaginationDetails;

	constructor(properties: GridProperties) {
		super(properties);
		const { dataProvider, pagination } = properties;

		this.registry = createRegistry(this.properties);

		this.own(this.on('properties:changed', (evt: PropertiesChangeEvent<LeGrid, GridProperties>) => {
			if (includes(evt.changedPropertyKeys, 'customCell')) {
				this.registry = createRegistry(evt.properties);
			}

			if (includes(evt.changedPropertyKeys, 'pagination')) {
				this.paginationDetails.dataRangeCount = evt.properties!.pagination!.itemsPerPage;
			}

			// TODO add changed of items per page
		}));

		if (pagination) {
			dataProvider.configure({ size: { start: 0, count: pagination.itemsPerPage }});
			this.paginationDetails = { dataRangeStart: 0, dataRangeCount: pagination.itemsPerPage };
		}
		else {
			this.paginationDetails = { dataRangeStart: 0, dataRangeCount: Infinity };
		}
	}

	onSortRequest(columnId: string, descending: boolean): void {
		const { properties: { dataProvider } } = this;

		this.sortDetails = { columnId, descending };
		dataProvider.sort({
			columnId,
			direction: descending ? 'desc' : 'asc'
		});
	}

	onPaginationRequest(pageNumber: string): void {
		const { properties: { dataProvider }, paginationDetails: { dataRangeCount } } = this;
		const dataRangeStart = (parseInt(pageNumber, 10) - 1) * dataRangeCount;

		dataProvider.fetch({
			start: dataRangeStart,
			count: dataRangeCount
		});

		this.paginationDetails = { dataRangeStart, dataRangeCount };
	}

	render(): DNode {
		const { paginationDetails, sortDetails, data: { items, totalCount }, properties: { dataProvider, columns }, registry } = this;

		return v('div', { classes: this.classes(css.grid).get(), role: 'grid' }, [
			w('grid-header', { registry, onSortRequest: this.onSortRequest.bind(this), sortDetails, columns } ),
			w('grid-body', { registry, dataProvider, columns, items } ),
			w('grid-footer', { onPaginationRequest: this.onPaginationRequest.bind(this), totalCount, paginationDetails } )
		]);
	}
}
