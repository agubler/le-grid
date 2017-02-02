import { assign } from '@dojo/core/lang';
import { DNode } from '@dojo/widget-core/interfaces';
import { isHNode } from '@dojo/widget-core/d';

import createCell, { GridCell, GridCellFactory } from './../createCell';

const createGridCell: GridCellFactory = createCell.after('render', function(this: GridCell, results: DNode) {
	const customClass = !!Math.round(Math.random()) ? { 'custom-cell': true } : { 'custom-cell': false };
	if (isHNode(results)) {
		assign(<any> results.properties.classes, customClass);
	}
	return results;
});

export default createGridCell;
