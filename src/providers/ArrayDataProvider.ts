import {
	DataProvider,
	BaseItem,
	ObserverPayload,
	DataProviderState,
	DispatchPayload,
	SortState,
	FetchState
} from './interfaces';
import Observable, { Observer } from '@dojo/core/Observable';
import { List, Iterable } from 'immutable';

export default class ArrayDataProvider<T extends BaseItem> implements DataProvider<T> {

	private currentState: DataProviderState<T>;
	private observers: Map<string, Observer<T>>;
	private storeObservers: Observer<ObserverPayload<T>>[];
	private data: List<T>;

	constructor(data: T[] = []) {
		this.currentState = {};
		this.observers = new Map<string, Observer<T>>();
		this.storeObservers = [];
		this.data = List(data);
	}

	configure(configuration: { sort?: Partial<SortState<T>>, size?: Partial<FetchState> }): void {
		if (configuration.size) {
			this.currentState.size = Object.assign({}, configuration.size);
		}
		if (configuration.sort) {
			this.currentState.sort = Object.assign({}, configuration.sort);
		}
		this.dispatch({
			data: this.data,
			state: this.currentState
		});
	}

	private dispatch(dispatchPayload: DispatchPayload<T, Iterable<number, T>>) {
		const { item, state: { sort, size } } = dispatchPayload;
		let data = dispatchPayload.data;

		if (sort) {
			data = data.sort((a: T, b: T) => {
				if (a[sort.columnId] < b[sort.columnId]) {
					return -1;
				}
				if (a[sort.columnId] > b[sort.columnId]) {
					return 1;
				}
				return 0;
			});

			if (sort.direction === 'desc') {
				data = data.reverse();
			}
		}

		if (size) {
			data = data.slice(size.start, size.start + size.count);
		}

		this.storeObservers.forEach((observer) => {
			observer.next({
				totalCount: this.data.size,
				state: this.currentState,
				items: data.toArray()
			});
		});

		if (item && this.observers.has(item.id)) {
			this.observers.get(item.id).next(item);
		}
	}

	private get(id: string) {
		return this.data.find((item) => {
			return Boolean(item && item.id === id);
		});
	}

	patch(items: T | T[]) {
		items = Array.isArray(items) ? items : [ items ];
		items.forEach((item) => {
			const existingItem = this.get(item.id);
			if (existingItem) {
				Object.assign(existingItem, item);
			}
			else {
				this.data = this.data.push(Object.assign({}, item));
			}
			this.dispatch({
				data: this.data,
				state: this.currentState,
				item: existingItem
			});
		});
	}

	put(items: T | T[]) {
		let existingItems: T[] = [];
		items = Array.isArray(items) ? items : [ items ];

		items = items.filter((item) => {
			if (this.get(item.id)) {
				existingItems.push(item);
				return false;
			}
			return true;
		});

		this.data = this.data.concat(items).toList();
		this.patch(existingItems);

		items.forEach((item) => {
			this.dispatch({
				data: this.data,
				state: this.currentState,
				item
			});
		});
	}

	fetch(fetchRequest: FetchState) {
		this.currentState = Object.assign({}, this.currentState);
		this.currentState.size = Object.assign({}, this.currentState.size, fetchRequest);
		this.dispatch({
			data: this.data,
			state: this.currentState
		});
	}

	sort(sortRequest: SortState<T>) {
		this.currentState = Object.assign({}, this.currentState);
		this.currentState.sort = Object.assign({}, this.currentState.sort, sortRequest);
		this.dispatch({
			data: this.data,
			state: this.currentState
		});
	}

	observe(): Observable<ObserverPayload<T>>;
	observe(ids: string[]): Observable<T>;
	observe(ids: string): Observable<T>
	observe(ids?: string | string[]): Observable<T> | Observable<ObserverPayload<T>> {
		if (ids) {
			return new Observable((observer: Observer<T>) => {
				if (typeof ids === 'string') {
					this.observers.set(ids, observer);
					this.dispatch({
						data: this.data,
						state: this.currentState,
						item: this.get(ids)
					});
				}
				else if (Array.isArray(ids)) {
					ids.forEach((id) => {
						this.observers.set(id, observer);
						this.dispatch({
							data: this.data,
							state: this.currentState,
							item: this.get(id)
						});
					});
				}
			});
		}

		return new Observable((observer: Observer<ObserverPayload<T>>) => {
			this.storeObservers.push(observer);
			this.dispatch({
				data: this.data,
				state: this.currentState
			});
		});
	}
}
