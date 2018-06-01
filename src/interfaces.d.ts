import { DNode } from '@dojo/widget-core/interfaces';

export interface FetcherMeta {
	total: number;
	isLoading: boolean;
}

export interface FetcherResult<S = any> {
	data: S[];
	meta: FetcherMeta;
}

export interface Fetcher<S = any> {
	(offset: number, size: number): Promise<FetcherResult<S>>;
}

export interface ColumnConfig {
	id: string;
	title: string | (() => DNode);
	renderer?: (props: any) => DNode;
}

export interface PageChangeCommandPayload {
	page: number;
	id: string;
}

export interface FetcherCommandPayload {
	fetcher: Fetcher;
	page: number;
	pageSize: number;
	id: string;
}

export interface GridPages {
	[index: string]: any[];
}

export interface GridMeta {
	page: number;
	total: number;
}

export interface GridData {
	pages: GridPages;
}

export interface GridState {
	[index: string]: {
		meta: GridMeta;
		data: GridData;
	};
}
