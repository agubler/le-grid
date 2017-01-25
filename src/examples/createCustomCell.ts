import { VNodeProperties } from '@dojo/interfaces/vdom';
import createCell, { GridCell, GridCellFactory } from './../createCell';

const createGridCell: GridCellFactory = createCell
	.mixin({
		mixin: {
			nodeAttributes: [
				function(this: GridCell, attributes: VNodeProperties): VNodeProperties {
					return { classes: { 'custom-cell': !!Math.round(Math.random()) } };
				}
			]
		}
	});

export default createGridCell;
