import { DNode } from '@dojo/widget-core/interfaces';

export interface FetcherMeta {
	total: number;
	isLoading: boolean;
}

export interface FetcherResult<S = any> {
	data: S[];
	meta: FetcherMeta;
}

export interface SortOptions {
	columnId: string;
	direction: 'asc' | 'desc';
}

export interface FilterOptions {
	columnId: string;
	value: any;
}

export interface FetcherOptions {
	sort?: SortOptions;
	filter?: FilterOptions;
}

export interface Fetcher<S = any> {
	(offset: number, size: number, options?: FetcherOptions): Promise<FetcherResult<S>>;
}

export interface ColumnConfig {
	id: string;
	title: string | (() => DNode);
	filterable?: boolean;
	sortable?: boolean;
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

export interface SortCommandPayload {
	id: string;
	fetcher: Fetcher;
	columnId: string;
	direction: 'asc' | 'desc';
}

export interface FilterCommandPayload {
	id: string;
	fetcher: Fetcher;
	columnId: string;
	value: any;
}

export interface GridPages<S> {
	[index: string]: S[];
}

export interface GridMeta {
	page: number;
	total: number;
	pageSize: number;
	sort: SortOptions;
	filter: FilterOptions;
	isSorting: boolean;
}

export interface GridData<S> {
	pages: GridPages<S>;
}

export interface GridState<S = any> {
	[index: string]: {
		meta: GridMeta;
		data: GridData<S>;
	};
}
