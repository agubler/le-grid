import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import ThemedMixin, { theme } from '@dojo/widget-core/mixins/Themed';
import diffProperty from '@dojo/widget-core/decorators/diffProperty';
import { reference } from '@dojo/widget-core/diff';
import { Store } from '@dojo/stores/Store';

import { Fetcher, ColumnConfig } from './../interfaces';
import { fetcherProcess } from './../processes';

import Header from './Header';
import Body from './Body';
import * as css from './Grid.m.css';
import { DNode } from '@dojo/widget-core/interfaces';

export interface LeGridProperties<S> {
	columnConfig: ColumnConfig[];
	fetcher: Fetcher<S>;
	updater: Function;
	store?: Store<S>;
	id?: string;
	rowHeight?: number;
	blockSize?: number;
}

@theme(css)
export default class Grid<S> extends ThemedMixin(WidgetBase)<LeGridProperties<S>> {
	private _store: Store = new Store<S>();
	private _block = 0;

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
		const { columnConfig, id = '_grid', blockSize = 50, rowHeight = 35, fetcher, updater } = this.properties;
		return { columnConfig, id, blockSize, rowHeight, fetcher, updater };
	}

	private _fetcher(blockToFetch: number) {
		fetcherProcess(this._store)({
			fetcher: this.properties.fetcher,
			block: blockToFetch
		}).then(() => {
			this._block = blockToFetch;
		});
	}

	protected render(): DNode {
		const { data = [], meta = {} } = this._store.get(this._store.path('_grid')) || ({} as any);
		const { columnConfig, rowHeight, blockSize } = this._getProperties();

		if (data.length === 0) {
			this._fetcher(1);
		}

		return v('div', { key: 'root', classes: css.grid }, [
			w(Header, { columnConfig }),
			w(Body, { data, meta, blockSize, rowHeight, columnConfig, fetcher: this._fetcher, block: this._block })
		]);
	}
}
