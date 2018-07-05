const { describe, it } = intern.getInterface('bdd');

import harness from '@dojo/test-extras/harness';
import { v, w } from '@dojo/widget-core/d';
import Row from '../../../src/widgets/Row';

import * as css from './../../../src/widgets/styles/Row.m.css';
import { ColumnConfig } from '../../../src/interfaces';
import Cell from '../../../src/widgets/Cell';

const noop = () => {};

describe('Row', () => {
	it('should render without columns', () => {
		const h = harness(() => w(Row, { id: 1, item: {}, columnConfig: [] as any, updater: noop }));
		h.expect(() => v('div', { classes: css.root, role: 'row' }, []));
	});

	it('should render items for column config', () => {
		const columnConfig: ColumnConfig = {
			id: 'id',
			title: 'id'
		};
		const h = harness(() => w(Row, { id: 1, item: { id: 'id' }, columnConfig: [columnConfig], updater: noop }));
		h.expect(() =>
			v('div', { classes: css.root, role: 'row' }, [
				w(Cell, { key: 'id', updater: noop, value: 'id', editable: undefined, rawValue: 'id' })
			])
		);
	});

	it('should call custom renderer with item value for column config', () => {
		const columnConfig: ColumnConfig = {
			id: 'id',
			title: 'id',
			renderer: (value: string) => 'transformed'
		};
		const h = harness(() => w(Row, { id: 1, item: { id: 'id' }, columnConfig: [columnConfig], updater: noop }));
		h.expect(() =>
			v('div', { classes: css.root, role: 'row' }, [
				w(Cell, { key: 'id', updater: noop, value: 'transformed', editable: undefined, rawValue: 'id' })
			])
		);
	});
});
