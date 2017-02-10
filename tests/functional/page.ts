import * as gridTheme from '../../src/styles/grid.css';
import * as gridFooter from '../../src/styles/gridFooter.css';
import * as gridCell from '../../src/styles/gridCell.css';
import * as gridHeaderCell from '../../src/styles/gridHeaderCell.css';
import * as gridRow from '../../src/styles/gridRow.css';
import Promise from '@dojo/shim/Promise';

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
			.findByCssSelector(`.${gridTheme.grid}`)
			.setFindTimeout(100);
	}

	isFooterVisible(): Promise<boolean> {
		return this.remote
			.findByCssSelector(`.${gridFooter.footer}`)
			.isDisplayed();
	}

	getCellValue(column: number, row: number): Promise<string> {
		return this.remote
			.findByCssSelector(`tr.${gridRow.gridRow}:nth-of-type(${row})`)
			.findByCssSelector(`td.${gridCell.cell}:nth-of-type(${column})`)
			.getVisibleText();
	}

	getFooterStatus() {
		return this.remote
			.findByCssSelector(`.${gridFooter.status}`)
			.getVisibleText();
	}

	sortColumn(column: number): Promise<any> {
		return this.remote
			.findByCssSelector(`th.${gridHeaderCell.cell}:nth-of-type(${column})`)
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
			.findByCssSelector(`.${gridFooter.nextPage}.${gridFooter.pageLink}`)
			.click()
			.end();
	}

	gotoLastPage(): Promise<any> {
		return this.remote
			.findByCssSelector(`.${gridFooter.pageLink}:last-of-type`)
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
