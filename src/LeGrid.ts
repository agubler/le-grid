import { WidgetBase, onPropertiesChanged } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties, PropertiesChangeEvent } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { DNode } from '@dojo/widget-core/interfaces';
import { includes } from '@dojo/shim/array';
import { w, v } from '@dojo/widget-core/d';
import WidgetRegistry from '@dojo/widget-core/WidgetRegistry';

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
	const registry = new WidgetRegistry();
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
export default class LeGrid extends LeGridBase<GridProperties> {

	private _sortDetails: SortDetails;

	private _paginationDetails: PaginationDetails = { dataRangeStart: 0, dataRangeCount: Infinity };

	@onPropertiesChanged
	protected onPropertiesChanged(evt: PropertiesChangeEvent<LeGrid, GridProperties>) {
		const { dataProvider, pagination = { itemsPerPage: Infinity } } = evt.properties;

		if (!this.registry || includes(evt.changedPropertyKeys, 'customCell')) {
			this.registry = createRegistry(evt.properties);
		}

		if (includes(evt.changedPropertyKeys, 'pagination')) {
			this._paginationDetails.dataRangeCount = pagination.itemsPerPage;
			dataProvider.configure({ size: { start: 0, count: pagination.itemsPerPage }});
		}
	}

	onSortRequest(columnId: string, descending: boolean): void {
		const { properties: { dataProvider } } = this;

		this._sortDetails = { columnId, descending };
		dataProvider.sort({
			columnId,
			direction: descending ? 'desc' : 'asc'
		});
	}

	onPaginationRequest(pageNumber: string): void {
		const { properties: { dataProvider }, _paginationDetails: { dataRangeCount } } = this;
		const dataRangeStart = (parseInt(pageNumber, 10) - 1) * dataRangeCount;

		dataProvider.fetch({
			start: dataRangeStart,
			count: dataRangeCount
		});

		this._paginationDetails = { dataRangeStart, dataRangeCount };
	}

	public render(): DNode {
		const { _paginationDetails, _sortDetails, data: { items, totalCount }, properties: { dataProvider, columns }, registry } = this;

		return v('div', { classes: this.classes(css.grid).get(), role: 'grid' }, [
			w('grid-header', { registry, onSortRequest: this.onSortRequest.bind(this), _sortDetails, columns } ),
			w('grid-body', { registry, dataProvider, columns, items } ),
			w('grid-footer', { onPaginationRequest: this.onPaginationRequest.bind(this), totalCount, _paginationDetails } )
		]);
	}
}
