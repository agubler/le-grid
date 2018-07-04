import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import ThemedMixin, { theme } from '@dojo/widget-core/mixins/Themed';
import diffProperty from '@dojo/widget-core/decorators/diffProperty';
import { DNode } from '@dojo/widget-core/interfaces';
import { reference } from '@dojo/widget-core/diff';
import { Store } from '@dojo/stores/Store';
import Dimensions from '@dojo/widget-core/meta/Dimensions';

import { Fetcher, ColumnConfig, GridState, Updater } from './../interfaces';
import { fetcherProcess, pageChangeProcess, sortProcess, filterProcess, updaterProcess } from './../processes';

import Header from './Header';
import Body from './Body';
import Footer from './Footer';
import * as css from './styles/Grid.m.css';

const defaultGridMeta = {
	page: 1,
	total: undefined,
	sort: undefined,
	filter: undefined,
	isSorting: false,
	editedRow: undefined
};

export interface LeGridProperties<S> {
	columnConfig: ColumnConfig[];
	fetcher: Fetcher<S>;
	updater?: Updater<S>;
	store?: Store<S>;
	id?: string;
}

@theme(css)
export default class Grid<S> extends ThemedMixin(WidgetBase)<LeGridProperties<S>> {
	private _store = new Store<GridState<S>>();
	private _handle: any;
	private _scrollLeft = 0;
	private _pageSize = 100;

	constructor() {
		super();
		this._handle = this._store.onChange(this._store.path('_grid'), this.invalidate.bind(this));
	}

	@diffProperty('store', reference)
	protected onStoreProperty(previous: any, current: any) {
		this._handle.remove();
		this._store = current.store;
		this._handle = this._store.onChange(this._store.path('_grid'), () => {
			this.invalidate();
		});
	}

	private _getProperties() {
		const { id = '_grid' } = this.properties;
		return { ...this.properties, id };
	}

	private _fetcher(page: number, pageSize: number) {
		const { id, fetcher } = this._getProperties();
		fetcherProcess(this._store)({ id, fetcher, page, pageSize });
	}

	private _sorter(columnId: string, direction: 'asc' | 'desc') {
		const { id, fetcher } = this._getProperties();
		sortProcess(this._store)({ id, fetcher, columnId, direction });
	}

	private _filterer(columnId: string, value: any) {
		const { id, fetcher } = this._getProperties();
		filterProcess(this._store)({ id, fetcher, columnId, value });
	}

	private _updater(page: number, rowNumber: number, columnId: string, value: string) {
		const { id, updater } = this._getProperties();
		updaterProcess(this._store)({ id, page, columnId, rowNumber, value, updater });
	}

	private _pageChange(page: number) {
		const { id } = this._getProperties();
		pageChangeProcess(this._store)({ id, page });
	}

	private _onScroll(value: number) {
		this._scrollLeft = value;
		this.invalidate();
	}

	protected render(): DNode {
		const { columnConfig, id } = this._getProperties();
		const meta = this._store.get(this._store.path(id, 'meta')) || defaultGridMeta;
		const pages = this._store.get(this._store.path(id, 'data', 'pages')) || {};
		const containerDimensions = this.meta(Dimensions).get('root');

		if (containerDimensions.size.height === 0) {
			return v('div', { key: 'root', classes: css.root, role: 'table' });
		}

		return v('div', { key: 'root', classes: css.root, role: 'table' }, [
			w(Header, {
				columnConfig,
				sorter: this._sorter,
				sort: meta.sort,
				filter: meta.filter,
				filterer: this._filterer,
				scrollLeft: this._scrollLeft
			}),
			w(Body, {
				pages,
				totalRows: meta.total,
				pageSize: this._pageSize,
				columnConfig,
				fetcher: this._fetcher,
				pageChange: this._pageChange,
				updater: this._updater,
				onScroll: this._onScroll,
				height: containerDimensions.size.height
			}),
			w(Footer, {
				total: meta.total,
				page: meta.page,
				pageSize: this._pageSize
			})
		]);
	}
}
