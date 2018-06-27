import { createProcess, createCommandFactory, Process } from '@dojo/stores/process';
import { replace, remove } from '@dojo/stores/state/operations';
import {
	FetcherResult,
	GridState,
	FetcherCommandPayload,
	PageChangeCommandPayload,
	SortCommandPayload,
	FilterCommandPayload,
	UpdaterCommandPayload
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
			const sortOptions = get(path(id, 'meta', 'sort'));
			const filterOptions = get(path(id, 'meta', 'filter'));
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

const preSortCommand = commandFactory<SortCommandPayload>(({ at, path, get, payload: { id, columnId, direction } }) => {
	return [
		remove(path(id, 'data', 'pages')),
		replace(path(id, 'meta', 'sort', 'columnId'), columnId),
		replace(path(id, 'meta', 'sort', 'direction'), direction),
		replace(path(id, 'meta', 'isSorting'), true)
	];
});

const preFilterCommand = commandFactory<FilterCommandPayload>(({ at, path, get, payload: { id, columnId, value } }) => {
	return [
		remove(path(id, 'data', 'pages')),
		replace(path(id, 'meta', 'filter', 'columnId'), columnId),
		replace(path(id, 'meta', 'filter', 'value'), value),
		replace(path(id, 'meta', 'page'), 1),
		replace(path(id, 'meta', 'isSorting'), true)
	];
});

const sortCommand = commandFactory<SortCommandPayload>(
	async ({ at, path, get, payload: { id, fetcher, columnId, direction } }) => {
		const page = get(path(id, 'meta', 'page'));
		const pageSize = get(path(id, 'meta', 'pageSize'));
		const filterOptions = get(path(id, 'meta', 'filter'));
		let result: FetcherResult;
		try {
			result = await fetcher(page - 1, pageSize * 2, { sort: { columnId, direction }, filter: filterOptions });
		} catch (err) {
			return [];
		}
		const previousPage = result.data.slice(0, pageSize);
		const currentPage = result.data.slice(pageSize);
		return [
			replace(path(id, 'data', 'pages', `page-${page - 1}`), previousPage),
			replace(path(id, 'data', 'pages', `page-${page}`), currentPage),
			replace(path(id, 'meta', 'sort', 'columnId'), columnId),
			replace(path(id, 'meta', 'sort', 'direction'), direction),
			replace(path(id, 'meta', 'total'), result.meta.total),
			replace(path(id, 'meta', 'page'), 1),
			replace(path(id, 'meta', 'isSorting'), false)
		];
	}
);

const filterCommand = commandFactory<FilterCommandPayload>(
	async ({ at, path, get, payload: { id, fetcher, columnId, value } }) => {
		const pageSize = get(path(id, 'meta', 'pageSize'));
		const sortOptions = get(path(id, 'meta', 'sort'));
		let result: FetcherResult;
		try {
			result = await fetcher(1, pageSize, { sort: sortOptions, filter: { columnId, value } });
		} catch (err) {
			return [];
		}
		const filterOptions = get(path(id, 'meta', 'filter'));
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

const preUpdateCommand = commandFactory<UpdaterCommandPayload>(
	({ at, path, get, payload: { id, updater, columnId, value, page, rowNumber } }) => {
		const item = get(at(path(id, 'data', 'pages', `page-${page}`), rowNumber));
		const updatedItem = { ...item, [columnId]: value };

		return [
			replace(at(path(id, 'data', 'pages', `page-${page}`), rowNumber), updatedItem),
			replace(path(id, 'meta', 'editedRow', 'page'), page),
			replace(path(id, 'meta', 'editedRow', 'index'), rowNumber),
			replace(path(id, 'meta', 'editedRow', 'item'), { ...item })
		];
	}
);

const updaterCommand = commandFactory<UpdaterCommandPayload>(
	async ({ at, path, get, payload: { id, updater, columnId, value, page, rowNumber } }) => {
		const item = get(at(path(id, 'data', 'pages', `page-${page}`), rowNumber));
		try {
			await updater(item);
		} catch (err) {
			const previousItem = get(path(id, 'meta', 'editedRow', 'item'));
			return [replace(at(path(id, 'data', 'pages', `page-${page}`), rowNumber), previousItem)];
		}

		return [replace(path(id, 'meta', 'editedRow'), undefined)];
	}
);

export const updaterProcess: Process<GridState, UpdaterCommandPayload> = createProcess('grid-update', [
	preUpdateCommand,
	updaterCommand
]);
export const fetcherProcess: Process<GridState, FetcherCommandPayload> = createProcess('grid-fetch', [fetcherCommand]);
export const filterProcess: Process<GridState, FilterCommandPayload> = createProcess('grid-filter', [
	preFilterCommand,
	filterCommand
]);
export const sortProcess: Process<GridState, SortCommandPayload> = createProcess('grid-sort', [
	preSortCommand,
	sortCommand
]);
export const pageChangeProcess: Process<GridState, PageChangeCommandPayload> = createProcess('grid-page-change', [
	pageChangeCommand
]);
