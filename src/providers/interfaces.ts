import Observable from '@dojo/core/Observable';

/**
 *
 */
export interface DataProviderState<T> {
	sort?: SortState<T>;
	size?: FetchState;
};

/**
 *
 */
export interface FetchState {
	count: number;
	start: number;
}

/**
 *
 */
export interface SortState<T> {
	columnId: keyof T;
	direction: 'desc' | 'asc';
}

/**
 *
 */
export interface BaseItem {
	[index: string]: any;
	id: string;
}

/**
 *
 */
export interface DispatchPayload<T extends BaseItem, D> {
	data: D;
	state: DataProviderState<T>;
	item?: T;
}

/**
 *
 */
export interface ObserverPayload<T extends BaseItem> {
	totalCount: number;
	state: DataProviderState<T>;
	items: T[];
}

/**
 *
 */
export interface DataProvider<T extends BaseItem> {

	configure(state: DataProviderState<T>): void;

	/**
	 *
	 */
	patch(item: T | T[]): void;

	/**
	 *
	 */
	put(item: T | T[]): void;

	/**
	 *
	 */
	fetch(fetchRequest: FetchState): void;

	/**
	 *
	 */
	sort(sortRequest: SortState<T>): void;

	/**
	 *
	 */
	observe(): Observable<ObserverPayload<T>>;
}
