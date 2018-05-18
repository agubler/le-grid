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
	(page: number, size: number): Promise<FetcherResult<S>>;
}

export interface ColumnConfig {
	id: string;
	title: string | (() => DNode);
	renderer?: (props: any) => DNode;
}
