import { DataProvider, BaseItem, ObserverPayload } from './interfaces';
import Observable, { Observer } from '@dojo/core/Observable';

interface DataProviderState<T> {
	sort?: SortState<T>;
	size?: SizeState;
};

interface SizeState {
	count: number;
	start: number;
}

interface SortState<T> {
	columnId: keyof T;
	direction: 'desc' | 'asc';
}

export default class ArrayDataProvider<T extends BaseItem> implements DataProvider<T> {

	private currentState: DataProviderState<T>;
	private observers: Map<string, Observer<T>>;
	private storeObservers: Observer<ObserverPayload<T>>[];
	private data: T[];

	constructor(data: T[] = []) {
		this.currentState = {};
		this.observers = new Map<string, Observer<T>>();
		this.storeObservers = [];
		this.data = [ ...data ];
	}

	configure(configuration: { sort?: Partial<SortState<T>>, size?: Partial<SizeState> }): void {
		if (configuration.size) {
			this.currentState.size = Object.assign({}, configuration.size);
		}
		if (configuration.sort) {
			this.currentState.sort = Object.assign({}, configuration.sort);
		}
		this.dispatch();
	}

	private dispatch(item?: T) {
		let dataCopy = [ ...this.data ];
		const { sort, size } = this.currentState;

		if (sort) {
			dataCopy.sort((a: T, b: T) => {
				if (a[sort.columnId] < b[sort.columnId]) {
					return -1;
				}
				if (a[sort.columnId] > b[sort.columnId]) {
					return 1;
				}
				return 0;
			});

			if (sort.direction === 'desc') {
				dataCopy.reverse();
			}
		}

		if (size) {
			dataCopy = dataCopy.slice(size.start, size.start + size.count);
		}

		this.storeObservers.forEach((observer) => {
			observer.next({
				totalCount: this.data.length,
				state: this.currentState,
				items: dataCopy
			});
		});

		if (item && this.observers.has(item.id)) {
			this.observers.get(item.id).next(item);
		}
	}

	private get(id: string) {
		return this.data.find((item) => {
			return item.id === id;
		});
	}

	patch(item: T) {
		const existingItem = this.get(item.id);
		if (existingItem) {
			Object.assign(existingItem, item);
		}
		else {
			this.data.push(Object.assign({}, item));
		}
		this.dispatch(existingItem);
	}

	fetch(fetchRequest: SizeState) {
		this.currentState = Object.assign({}, this.currentState);
		this.currentState.size = Object.assign({}, this.currentState.size, fetchRequest);
		this.dispatch();
	}

	sort(sortRequest: SortState<T>) {
		this.currentState = Object.assign({}, this.currentState);
		this.currentState.sort = Object.assign({}, this.currentState.sort, sortRequest);
		this.dispatch();
	}

	observe(): Observable<ObserverPayload<T>>;
	observe(ids: string[]): Observable<T>;
	observe(ids: string): Observable<T>
	observe(ids?: string | string[]): Observable<T> | Observable<ObserverPayload<T>> {
		if (ids) {
			return new Observable((observer: Observer<T>) => {
				if (typeof ids === 'string') {
					this.observers.set(ids, observer);
					this.dispatch(this.get(ids));
				}
				else if (Array.isArray(ids)) {
					ids.forEach((id) => {
						this.observers.set(id, observer);
						this.dispatch(this.get(id));
					});
				}
			});
		}

		return new Observable((observer: Observer<ObserverPayload<T>>) => {
			this.storeObservers.push(observer);
			this.dispatch();
		});
	}
}
