import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import ThemedMixin, { theme } from '@dojo/widget-core/mixins/Themed';
import diffProperty from '@dojo/widget-core/decorators/diffProperty';
import { DNode } from '@dojo/widget-core/interfaces';
import { reference } from '@dojo/widget-core/diff';
import { Store } from '@dojo/stores/Store';

import { Fetcher, ColumnConfig } from './../interfaces';
import { fetcherProcess, pageChangeProcess } from './../processes';

import Header from './Header';
import Body from './Body';
import Footer from './Footer';
import * as css from './styles/Grid.m.css';

export interface LeGridProperties<S> {
	columnConfig: ColumnConfig[];
	fetcher: Fetcher<S>;
	store?: Store<S>;
	id?: string;
	pageSize?: number;
}

@theme(css)
export default class Grid<S> extends ThemedMixin(WidgetBase)<LeGridProperties<S>> {
	private _store: Store = new Store<S>();

	constructor() {
		super();
		this._store.onChange(this._store.path('_grid'), this.invalidate.bind(this));
	}

	@diffProperty('store', reference)
	protected onStoreProperty(previous: any, current: any) {
		this._store.destroy();
		this._store = current.store;
		this._store.onChange(this._store.path('_grid'), this.invalidate.bind(this));
	}

	private _getProperties() {
		const { columnConfig, id = '_grid', pageSize = 100, fetcher } = this.properties;
		return { columnConfig, id, fetcher, pageSize };
	}

	private _fetcher(page: number, pageSize: number) {
		const { id, fetcher } = this._getProperties();
		fetcherProcess(this._store)({ id, fetcher, page, pageSize });
	}

	private _pageChange(page: number) {
		const { id } = this._getProperties();
		pageChangeProcess(this._store)({ id, page });
	}

	protected render(): DNode {
		const meta = this._store.get(this._store.path('_grid', 'meta')) || {};
		const pages = this._store.get(this._store.path('_grid', 'data', 'pages')) || {};
		const { columnConfig, pageSize } = this._getProperties();

		return v('div', { key: 'root', classes: css.root }, [
			w(Header, { columnConfig }),
			w(Body, {
				pages,
				totalRows: meta.total,
				pageSize,
				columnConfig,
				fetcher: this._fetcher,
				pageChange: this._pageChange
			}),
			w(Footer, {
				total: meta.total,
				page: meta.page,
				pageSize
			})
		]);
	}
}
