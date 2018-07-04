const { describe, it } = intern.getInterface('bdd');

import harness from '@dojo/test-extras/harness';
import { v, w } from '@dojo/widget-core/d';
import Row from '../../../src/widgets/Row';

import * as css from './../../../src/widgets/styles/Row.m.css';

const noop = () => {};

describe('Row', () => {
	it('should render without columns', () => {
		const h = harness(() => w(Row, { id: 1, item: {}, columnConfig: [] as any, updater: noop }));
		h.expect(() => v('div', { classes: css.root, role: 'row' }, []));
	});
});
