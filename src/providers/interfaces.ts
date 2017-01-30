import Observable from '@dojo/core/Observable';

/**
 *
 */
export interface DataProviderState<T> {
	sort?: SortState<T>;
	size?: SizeState;
};

/**
 *
 */
export interface SizeState {
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
	patch(item: T): void;

	/**
	 *
	 */
	fetch(fetchRequest: SizeState): void;

	/**
	 *
	 */
	sort(sortRequest: SortState<T>): void;

	/**
	 *
	 */
	observe(): Observable<ObserverPayload<T>>;
	observe(ids: string[]): Observable<T>;
	observe(ids: string): Observable<T>;
}
