import gridTheme from '../../src/styles/grid';
import gridFooter from '../../src/styles/gridFooter';
import gridCell from '../../src/styles/gridCell';
import gridHeaderCell from '../../src/styles/gridHeaderCell';
import gridRow from '../../src/styles/gridRow';

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
			.findByCssSelector(`.${gridTheme.classes.grid}`)
			.setFindTimeout(100);
	}

	isFooterVisible(): Promise<boolean> {
		return this.remote
			.findByCssSelector(`.${gridFooter.classes.footer}`)
			.isDisplayed();
	}

	getCellValue(column: number, row: number): Promise<string> {
		return this.remote
			.findByCssSelector(`tr.${gridRow.classes.gridRow}:nth-of-type(${row})`)
			.findByCssSelector(`td.${gridCell.classes.cell}:nth-of-type(${column})`)
			.getVisibleText();
	}

	getFooterStatus() {
		return this.remote
			.findByCssSelector(`.${gridFooter.classes.status}`)
			.getVisibleText();
	}

	sortColumn(column: number): Promise<any> {
		return this.remote
			.findByCssSelector(`th.${gridHeaderCell.classes.cell}:nth-of-type(${column})`)
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
			.findByCssSelector(`.${gridFooter.classes.nextPage}.${gridFooter.classes.pageLink}`)
			.click()
			.end();
	}

	gotoLastPage(): Promise<any> {
		return this.remote
			.findByCssSelector(`.${gridFooter.classes.pageLink}:last-of-type`)
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
