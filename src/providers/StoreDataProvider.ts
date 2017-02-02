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
import { createQueryStore, QueryStore } from '@dojo/stores/store/mixins/createQueryTransformMixin';
import createSort from '@dojo/stores/query/createSort';

export default class StoreDataProvider<T extends BaseItem> implements DataProvider<T, T> {

	private currentState: DataProviderState<T>;
	private observers: Map<string, Observer<T>>;
	private storeObservers: Observer<ObserverPayload<T, T>>[];
	private store: QueryStore<any, any>;
	private subscription: any;
	private totalCount: number;

	constructor(data: T[] | QueryStore<any, any> = []) {
		this.currentState = {};
		this.observers = new Map<string, Observer<T>>();
		this.storeObservers = [];
		if (Array.isArray(data)) {
			data = createQueryStore({ data });
		}
		this.store = data;
		this.store.observe().subscribe((items: any) => {
			this.totalCount = items.afterAll.length;
		});
	}

	configure(configuration: { sort?: Partial<SortState<T>>, size?: Partial<FetchState> }): void {
		if (configuration.size) {
			this.currentState.size = Object.assign({}, configuration.size);
		}
		if (configuration.sort) {
			this.currentState.sort = Object.assign({}, configuration.sort);
		}
		this.dispatch({
			data: this.store,
			state: this.currentState
		});
	}

	private dispatch(dispatchPayload: DispatchPayload<T, QueryStore<any, any>>) {
		const { state: { sort, size } } = dispatchPayload;
		let store = dispatchPayload.data;
		let filteredStore;

		if (sort) {
			filteredStore = store.sort(createSort([ sort.columnId ], [ sort.direction === 'desc' ]));
		}

		if (size) {
			filteredStore = (filteredStore || store).range(size.start, size.count);
		}

		if (!filteredStore) {
			filteredStore = store;
		}

		if (this.subscription) {
			this.subscription.unsubscribe();
		}

		this.subscription = filteredStore.observe().subscribe((items: any) => {
			this.storeObservers.forEach((observer) => {
				observer.next({
					totalCount: this.totalCount,
					state: this.currentState,
					items: items.afterAll
				});
			});
		});
	}

	patch(item: T | T[]) {
		this.store.patch(item);
	}

	put(item: T | T[]) {
		this.store.put(item);
	}

	fetch(fetchRequest: FetchState) {
		this.currentState = Object.assign({}, this.currentState);
		this.currentState.size = Object.assign({}, this.currentState.size, fetchRequest);
		this.dispatch({
			data: this.store,
			state: this.currentState
		});
	}

	sort(sortRequest: SortState<T>) {
		this.currentState = Object.assign({}, this.currentState);
		this.currentState.sort = Object.assign({}, this.currentState.sort, sortRequest);
		this.dispatch({
			data: this.store,
			state: this.currentState
		});
	}

	observe(): Observable<ObserverPayload<T, T>> {
		return new Observable((observer: Observer<ObserverPayload<T, T>>) => {
			this.storeObservers.push(observer);
			this.dispatch({
				data: this.store,
				state: this.currentState
			});
		});
	}
}
