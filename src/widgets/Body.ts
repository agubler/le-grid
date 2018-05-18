import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import ThemedMixin, { theme } from '@dojo/widget-core/mixins/Themed';
import Dimensions from '@dojo/widget-core/meta/Dimensions';
import { ColumnConfig, FetcherMeta } from './../interfaces';

import Row from './Row';
import * as css from './styles/Body.m.css';
import { DNode } from '@dojo/widget-core/interfaces';

export interface BodyProperties<S> {
	data: S[];
	meta: FetcherMeta;
	columnConfig: ColumnConfig[];
	block: number;
	blockSize: number;
	rowHeight: number;
	fetcher: (block: number) => void;
}

@theme(css)
export default class Body<S> extends ThemedMixin(WidgetBase)<BodyProperties<S>> {
	private _blockLoading = 0;
	private _maxBlock = 2;
	private _renderedRowCount = 0;

	private _getCurrentBlock() {
		const { blockSize, rowHeight } = this.properties;
		const currentRow = this.meta(Dimensions).get('body').scroll.top / rowHeight;
		return Math.ceil(Math.min(Math.max(currentRow / blockSize, 1), this._maxBlock - 1));
	}

	private _loader() {
		const { block } = this.properties;
		const blockToLoad = this._getCurrentBlock();

		if (blockToLoad <= this._maxBlock && block !== blockToLoad && this._blockLoading !== blockToLoad) {
			this._blockLoading = blockToLoad;
			this.properties.fetcher(blockToLoad);
		}
	}

	private _getBlockHeights() {
		const { blockSize, rowHeight, meta: { total } } = this.properties;
		let previousBlockHeight = 0;
		let nextBlockHeight = 0;
		if (this._blockLoading > 2) {
			previousBlockHeight = (this._blockLoading - 2) * blockSize * rowHeight;
		}
		if (this._blockLoading < this._maxBlock) {
			nextBlockHeight = total * rowHeight - previousBlockHeight - 3 * blockSize * rowHeight;
		}
		return { previousBlockHeight, nextBlockHeight };
	}

	protected render(): DNode {
		const { columnConfig, rowHeight, blockSize, data, meta: { total, isLoading } } = this.properties;
		const { previousBlockHeight, nextBlockHeight } = this._getBlockHeights();
		const currentScrollTop = this.meta(Dimensions).get('body').scroll.top;

		this._renderedRowCount = 3 * blockSize;
		this._maxBlock = Math.ceil(total / blockSize);

		let rows: any[] = [v('div', { key: 'prev', styles: { height: `${previousBlockHeight}px` } })];
		if (isLoading) {
			console.log('show loading', 'previous', previousBlockHeight, 'next', nextBlockHeight);
			for (let i = 0; i < this._renderedRowCount; i++) {
				rows.push(
					w(Row, {
						key: i,
						height: rowHeight,
						item: false,
						columnConfig
					})
				);
			}
		} else {
			console.log('show real', 'previous', previousBlockHeight, 'next', nextBlockHeight);
			for (let i = 0; i < data.length; i++) {
				rows.push(
					w(Row, {
						key: i,
						height: rowHeight,
						item: data[i],
						columnConfig
					})
				);
			}
		}

		if (data.length) {
			rows.push(v('div', { key: 'next', styles: { height: `${nextBlockHeight}px` } }));
		}

		const gridProperties = {
			key: 'body',
			scrollTop: currentScrollTop,
			classes: css.root,
			onscroll: this._loader
		};

		return v('div', gridProperties, rows);
	}
}
