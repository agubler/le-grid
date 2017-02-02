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
import { List, Iterable, fromJS, Map as ImmutableMap } from 'immutable';

export default class ArrayDataProvider<T extends BaseItem> implements DataProvider<ImmutableMap<string, any>, T> {

	private currentState: DataProviderState<T>;
	private observers: Map<string, Observer<T>>;
	private storeObservers: Observer<ObserverPayload<ImmutableMap<string, any>, T>>[];
	private data: List<ImmutableMap<string, any>>;

	constructor(data: T[] = []) {
		this.currentState = {};
		this.observers = new Map<string, Observer<T>>();
		this.storeObservers = [];
		this.data = fromJS(data);
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

	private dispatch(dispatchPayload: DispatchPayload<T, Iterable<number, ImmutableMap<string, any>>>) {
		const { state: { sort, size } } = dispatchPayload;
		let data = dispatchPayload.data;

		if (sort) {
			data = data.sort((a: ImmutableMap<string, any>, b: ImmutableMap<string, any>) => {
				if (a.get(sort.columnId) < b.get(sort.columnId)) {
					return -1;
				}
				if (a.get(sort.columnId) > b.get(sort.columnId)) {
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
	}

	patch(newItems: T | T[]) {
		newItems = Array.isArray(newItems) ? newItems : [ newItems ];

		newItems.forEach((newItem) => {
			const index = this.data.findIndex((item) => {
				return Boolean(item && item.get('id') === newItem.id);
			});

			if (index !== -1) {
				this.data = this.data.update(index, (item) => {
					return item.merge(newItem);
				});
			}
			else {
				this.data = this.data.push(ImmutableMap(newItem));
			}
		});

		this.dispatch({
			data: this.data,
			state: this.currentState
		});
	}

	put(items: T | T[]) {
		this.patch(items);
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

	observe(): Observable<ObserverPayload<ImmutableMap<string, any>, T>> {
		return new Observable((observer: Observer<ObserverPayload<ImmutableMap<string, any>, T>>) => {
			this.storeObservers.push(observer);
			this.dispatch({
				data: this.data,
				state: this.currentState
			});
		});
	}
}
