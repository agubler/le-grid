import { createProcess, createCommandFactory } from '@dojo/stores/process';
import { replace } from '@dojo/stores/state/operations';
import { Fetcher, FetcherResult } from './interfaces';

const commandFactory = createCommandFactory<any>();

const startFetcherCommand = commandFactory(({ path, get, payload: { block } }) => {
	return [replace(path('_grid', 'meta', 'isLoading'), true), replace(path('_grid', 'meta', 'page'), block)];
});

const fetcherCommand = commandFactory<{ fetcher: Fetcher; block: number }>(
	async ({ path, get, payload: { fetcher, block } }) => {
		let result: FetcherResult;
		try {
			result = await fetcher(block, 150);
		} catch (error) {
			return [
				replace(path('_grid', 'meta', 'hasError'), true),
				replace(path('_grid', 'meta', 'message'), error.message)
			];
		}
		const loadingPage = get(path('_grid', 'meta', 'page'));
		if (block === loadingPage) {
			return [
				replace(path('_grid', 'data'), result.data),
				replace(path('_grid', 'meta', 'isLoading'), false),
				replace(path('_grid', 'meta', 'total'), result.meta.total),
				replace(path('_grid', 'meta', 'page'), block)
			];
		}
		return [];
	}
);

export const fetcherProcess = createProcess('grid-fetch', [startFetcherCommand, fetcherCommand]);
