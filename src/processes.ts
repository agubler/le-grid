import { createProcess, createCommandFactory, Process } from '@dojo/stores/process';
import { replace, remove } from '@dojo/stores/state/operations';
import {
	FetcherResult,
	GridState,
	FetcherCommandPayload,
	PageChangeCommandPayload,
	SortCommandPayload,
	FilterCommandPayload
} from './interfaces';

const commandFactory = createCommandFactory<GridState>();

const pageChangeCommand = commandFactory<PageChangeCommandPayload>(({ path, get, payload: { id, page } }) => {
	const currentPage = get(path(id, 'meta', 'page'));
	if (page !== currentPage) {
		return [replace(path(id, 'meta', 'page'), page)];
	}
	return [];
});

const fetcherCommand = commandFactory<FetcherCommandPayload>(
	async ({ at, path, get, payload: { id, fetcher, page, pageSize } }) => {
		let result: FetcherResult;
		const isSorting = get(path(id, 'meta', 'isSorting')) || false;
		if (!isSorting) {
			const sortOptions = get(path(id, 'meta', 'sort')) || {};
			const filterOptions = get(path(id, 'meta', 'filter')) || {};
			try {
				result = await fetcher(page, pageSize, { sort: sortOptions, filter: filterOptions });
			} catch (error) {
				return [remove(path(id, 'data', 'pages', `page-${page}`))];
			}
			return [
				replace(path(id, 'data', 'pages', `page-${page}`), result.data),
				replace(path(id, 'meta', 'total'), result.meta.total),
				replace(path(id, 'meta', 'pageSize'), pageSize)
			];
		} else {
			return [];
		}
	}
);

const clearDataCommand = commandFactory<SortCommandPayload>(
	({ at, path, get, payload: { id, columnId, direction } }) => {
		return [
			remove(path(id, 'data', 'pages')),
			replace(path(id, 'meta', 'sort', 'columnId'), columnId),
			replace(path(id, 'meta', 'sort', 'direction'), direction),
			replace(path(id, 'meta', 'isSorting'), true)
		];
	}
);

const clearFilterDataCommand = commandFactory<FilterCommandPayload>(
	({ at, path, get, payload: { id, columnId, value } }) => {
		return [
			remove(path(id, 'data', 'pages')),
			replace(path(id, 'meta', 'filter', 'columnId'), columnId),
			replace(path(id, 'meta', 'filter', 'value'), value),
			replace(path(id, 'meta', 'page'), 1),
			replace(path(id, 'meta', 'isSorting'), true)
		];
	}
);

const sortCommand = commandFactory<SortCommandPayload>(
	async ({ at, path, get, payload: { id, fetcher, columnId, direction } }) => {
		const page = get(path(id, 'meta', 'page'));
		const pageSize = get(path(id, 'meta', 'pageSize'));
		const filterOptions = get(path(id, 'meta', 'filter')) || {};
		let result: FetcherResult[];
		try {
			result = await Promise.all([
				fetcher(page - 1, pageSize, { sort: { columnId, direction }, filter: filterOptions }),
				fetcher(page, pageSize, { sort: { columnId, direction }, filter: filterOptions })
			]);
		} catch {
			return [];
		}
		return [
			replace(path(id, 'data', 'pages', `page-${page}`), result[1].data),
			replace(path(id, 'data', 'pages', `page-${page - 1}`), result[0].data),
			replace(path(id, 'meta', 'sort', 'columnId'), columnId),
			replace(path(id, 'meta', 'sort', 'direction'), direction),
			replace(path(id, 'meta', 'total'), result[1].meta.total),
			replace(path(id, 'meta', 'page'), 1),
			replace(path(id, 'meta', 'isSorting'), false)
		];
	}
);

const filterCommand = commandFactory<FilterCommandPayload>(
	async ({ at, path, get, payload: { id, fetcher, columnId, value } }) => {
		const pageSize = get(path(id, 'meta', 'pageSize'));
		const sortOptions = get(path(id, 'meta', 'sort')) || {};
		let result: FetcherResult;
		try {
			result = await fetcher(1, pageSize, { sort: sortOptions, filter: { columnId, value } });
		} catch {
			return [];
		}
		const filterOptions = get(path(id, 'meta', 'filter')) || {};
		if (filterOptions.columnId !== columnId || filterOptions.value !== value) {
			throw new Error();
		}
		return [
			remove(path(id, 'data', 'pages')),
			replace(path(id, 'data', 'pages', 'page-1'), result.data),
			replace(path(id, 'meta', 'filter', 'columnId'), columnId),
			replace(path(id, 'meta', 'filter', 'value'), value),
			replace(path(id, 'meta', 'total'), result.meta.total),
			replace(path(id, 'meta', 'isSorting'), false)
		];
	}
);

export const fetcherProcess: Process<GridState, FetcherCommandPayload> = createProcess('grid-fetch', [fetcherCommand]);
export const filterProcess: Process<GridState, FilterCommandPayload> = createProcess('grid-filter', [
	clearFilterDataCommand,
	filterCommand
]);
export const sortProcess: Process<GridState, SortCommandPayload> = createProcess('grid-sort', [
	clearDataCommand,
	sortCommand
]);
export const pageChangeProcess: Process<GridState, PageChangeCommandPayload> = createProcess('grid-page-change', [
	pageChangeCommand
]);
