import { VNodeProperties } from '@dojo/interfaces/vdom';
import createCell, { DgridCell, DgridCellFactory } from './../createCell';

const createDgridCell: DgridCellFactory = createCell
	.mixin({
		mixin: {
			nodeAttributes: [
				function(this: DgridCell, attributes: VNodeProperties): VNodeProperties {
					return { classes: { 'custom-cell': !!Math.round(Math.random()) } };
				}
			]
		}
	});

export default createDgridCell;
