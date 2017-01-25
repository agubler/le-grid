export default class Page {
	private remote: any;

	constructor(remote: any) {
		this.remote  = remote;
	}

	delay(): Promise<any> {
		return new Promise((resolve) => setTimeout(resolve, 60));
	}

	init(): Promise<any> {
		return this.remote
			.get('http://localhost:9000/_build/tests/functional/index.html')
			.setFindTimeout(5000)
			.findByCssSelector('.grid-widgets.grid.grid-grid')
			.setFindTimeout(100);
	}

	isFooterVisible(): Promise<boolean> {
		return this.remote
			.findByCssSelector('.grid-footer')
			.isDisplayed();
	}

	getCellValue(column: number, row: number): Promise<string> {
		return this.remote
			.findByCssSelector(`tr.grid-row:nth-of-type(${row})`)
			.findByCssSelector(`td.grid-cell:nth-of-type(${column})`)
			.getVisibleText();
	}

	getFooterStatus() {
		return this.remote
			.findByCssSelector('.grid-status')
			.getVisibleText();
	}

	sortColumn(column: number): Promise<any> {
		return this.remote
			.findByCssSelector(`th.grid-cell:nth-of-type(${column})`)
			.click()
			.end();
	}

	clickButton(): Promise<any> {
		return this.remote
			.findByCssSelector('button')
			.click()
			.end();
	}

	gotoNextPage(): Promise<any> {
		return this.remote
			.findByCssSelector('.grid-next.grid-page-link')
			.click()
			.end();
	}

	gotoLastPage(): Promise<any> {
		return this.remote
			.findByCssSelector('.grid-page-link:last-of-type')
			.click()
			.end();
	}

	hasCustomCells(): Promise<boolean> {
		return this.remote
			.findAllByCssSelector('.custom-cell')
			.then((elems: any) => {
				return !!elems.length;
			});
	}
}
