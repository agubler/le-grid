import * as test from 'intern/lib/interfaces/bdd';
import { assert } from 'chai';
import Page from './page';

test.describe('le-grid', function (this: any) {
	let page: any;

	test.beforeEach(() => {
		page = new Page(this.remote);
		return page.init();
	});

	test.it('Sort by Age Column', function (this: any) {
		return this.remote
			.then(() => page.getCellValue(1, 1))
			.then((value: any) => {
				assert.equal(value, '1 years old');
			})
			.then(() => page.sortColumn(1))
			.then(() => page.getCellValue(1, 1))
			.then((value: any) => {
				assert.equal(value, '20 years old');
			});

	});

	test.it('Sort by Gender Column', function (this: any) {
		return this.remote
			.then(() => page.getCellValue(2, 1))
			.then((value: any) => {
				assert.equal(value, 'is a A');
			})
			.then(() => page.sortColumn(2))
			.then(() => page.getCellValue(2, 1))
			.then((value: any) => {
				assert.equal(value, 'is a Z');
			});
	});

	test.it('Use Custom Cell', function(this: any) {
		return this.remote
			.then(() => page.hasCustomCells())
			.then((hasCustomCells: boolean) => {
				assert.isFalse(hasCustomCells);
			})
			.then(() => page.clickButton())
			.then(() => page.hasCustomCells())
			.then((hasCustomCells: boolean) => {
				assert.isTrue(hasCustomCells);
			});
	});

	test.it('Goto Next Page', function(this: any) {
		return this.remote
			.then(() => page.getCellValue(2, 1))
			.then((value: any) => {
				assert.equal(value, 'is a A');
			})
			.then(() => page.getFooterStatus())
			.then((value: any) => {
				assert.equal(value, '1 - 5 of 40 results');
			})
			.then(() => page.gotoNextPage())
			.then(() => page.getCellValue(2, 1))
			.then((value: any) => {
				assert.equal(value, 'is a F');
			})
			.then(() => page.getFooterStatus())
			.then((value: any) => {
				assert.equal(value, '6 - 10 of 40 results');
			});
	});

	test.it('Goto Last Page', function(this: any) {
		return this.remote
			.then(() => page.getFooterStatus())
			.then((value: any) => {
				assert.equal(value, '1 - 5 of 40 results');
			})
			.then(() => page.gotoLastPage())
			.then(() => page.getFooterStatus())
			.then((value: any) => {
				assert.equal(value, '36 - 40 of 40 results');
			});
	});
});
