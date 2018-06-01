import { createProcess, createCommandFactory, Process } from '@dojo/stores/process';
import { replace, remove } from '@dojo/stores/state/operations';
import { FetcherResult, GridState, FetcherCommandPayload, PageChangeCommandPayload } from './interfaces';

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
		try {
			result = await fetcher(page, pageSize);
		} catch (error) {
			return [remove(path(id, 'data', 'pages', `page-${page}`))];
		}
		return [
			replace(path(id, 'data', 'pages', `page-${page}`), result.data),
			replace(path(id, 'meta', 'total'), result.meta.total)
		];
	}
);

export const fetcherProcess: Process<GridState, FetcherCommandPayload> = createProcess('grid-fetch', [fetcherCommand]);

export const pageChangeProcess: Process<GridState, PageChangeCommandPayload> = createProcess('grid-page-change', [
	pageChangeCommand
]);
