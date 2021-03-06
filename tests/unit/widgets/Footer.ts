const { describe, it } = intern.getInterface('bdd');

import harness from '@dojo/framework/testing/harness';
import { v, w } from '@dojo/framework/widget-core/d';

import * as css from './../../../src/widgets/styles/Footer.m.css';
import Footer from '../../../src/widgets/Footer';

describe('Footer', () => {
	it('should render footer without total', () => {
		const h = harness(() =>
			w(Footer, {
				page: 1,
				pageSize: 100
			})
		);
		h.expect(() => v('div', { classes: css.root }, ['Page 1 of ?']));
	});

	it('should render footer with total', () => {
		const h = harness(() =>
			w(Footer, {
				total: 9998,
				page: 1,
				pageSize: 100
			})
		);
		h.expect(() => v('div', { classes: css.root }, ['Page 1 of 100. Total rows 9998']));
	});
});
