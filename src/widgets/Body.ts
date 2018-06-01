import global from '@dojo/shim/global';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import ThemedMixin, { theme } from '@dojo/widget-core/mixins/Themed';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { DNode } from '@dojo/widget-core/interfaces';

import { GridPages } from './../interfaces';
import PlaceholderRow from './PlaceholderRow';
import Row from './Row';

import * as css from './styles/Body.m.css';

export interface BodyProperties {
	placeholderRowRenderer?: (index: number) => DNode;
	totalRows: number;
	pageSize: number;
	pages: GridPages;
	fetcher: (page: number, pageSize: number) => void;
	pageChange: (page: number) => void;
	columnConfig: any;
}

const offscreen = (dnode: DNode) => {
	const Projector = ProjectorMixin(
		class extends WidgetBase {
			render() {
				return dnode;
			}
		}
	);
	const div = global.document.createElement('div');
	div.style.position = 'absolute';
	global.document.body.appendChild(div);
	const projector = new Projector();
	projector.async = false;
	projector.append(div);
	const dimensions = div.getBoundingClientRect();
	projector.destroy();
	global.document.body.removeChild(div);
	return dimensions;
};

const defaultPlaceholderRowRenderer = (index: number) => {
	return w(PlaceholderRow, { key: index });
};

@theme(css)
export default class Body extends ThemedMixin(WidgetBase)<BodyProperties> {
	private _rowHeight: number;
	private _viewportHeight: number;
	private _rowsInView: number;
	private _renderPageSize: number;
	private _start = 0;
	private _end = 100;

	private _onScroll(event: UIEvent) {
		const { totalRows } = this.properties;
		const scrollTop = (event.target as HTMLElement).scrollTop;
		const topRow = Math.round(scrollTop / this._rowHeight);
		const bottomRow = topRow + this._rowsInView;
		if (topRow <= this._start) {
			this._start = Math.max(0, topRow - this._renderPageSize);
			this._end = this._start + this._renderPageSize * 2;
		}
		if (bottomRow >= this._end) {
			this._start = Math.min(topRow, totalRows - this._renderPageSize);
			this._end = this._start + this._renderPageSize * 2;
		}
		this.invalidate();
	}

	private _renderRows(start: number, end: number) {
		const {
			pageSize,
			fetcher,
			pages,
			columnConfig,
			placeholderRowRenderer = defaultPlaceholderRowRenderer,
			pageChange
		} = this.properties;

		const startPage = Math.max(Math.ceil(start / pageSize), 1);
		const endPage = Math.ceil(end / pageSize);

		let data = pages[`page-${startPage}`] || [];

		if (!data.length) {
			fetcher(startPage, pageSize);
		}

		if (startPage !== endPage) {
			const endData = pages[`page-${endPage}`] || [];
			if (!endData.length) {
				fetcher(endPage, pageSize);
			}
			pageChange(endPage);
			data = [...data, ...endData];
		} else {
			pageChange(startPage);
		}

		const rows: DNode[] = [];

		for (let i = start; i < end; i++) {
			const offset = i - (startPage * pageSize - pageSize);
			const item = data[offset];
			if (item) {
				rows.push(
					w(Row, {
						key: i,
						item,
						columnConfig
					})
				);
			} else {
				rows.push(placeholderRowRenderer(i));
			}
		}

		return rows;
	}

	protected render(): DNode {
		const { placeholderRowRenderer = defaultPlaceholderRowRenderer, totalRows } = this.properties;

		if (!this._rowHeight) {
			const firstRow = placeholderRowRenderer(0);
			const dimensions = offscreen(firstRow);
			this._rowHeight = dimensions.height;
			this._viewportHeight = this._rowHeight * 15;
			this._rowsInView = this._viewportHeight / this._rowHeight;
			this._renderPageSize = this._rowsInView * 2;
		}

		const rows = this._renderRows(this._start, this._end);
		const topPaddingHeight = this._rowHeight * this._start;
		const bottomPaddingHeight =
			totalRows * this._rowHeight - topPaddingHeight - (this._end - this._start) * this._rowHeight;

		return v(
			'div',
			{
				classes: css.root,
				styles: {
					height: `${this._viewportHeight}px`
				},
				onscroll: this._onScroll
			},
			[
				v('div', { key: 'top', styles: { height: `${topPaddingHeight}px` } }),
				...rows,
				v('div', {
					key: 'bottom',
					styles: { height: `${bottomPaddingHeight}px` }
				})
			]
		);
	}
}
