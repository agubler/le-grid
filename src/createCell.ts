import { Widget, WidgetProperties, WidgetFactory, DNode } from '@dojo/widgets/interfaces';
import createWidgetBase from '@dojo/widgets/createWidgetBase';

export interface DgridCellProperties extends WidgetProperties {
	data: string;
}

export type DgridCell = Widget<DgridCellProperties>

export interface DgridCellFactory extends WidgetFactory<DgridCell, DgridCellProperties> { }

const createDgridCell: DgridCellFactory = createWidgetBase
	.mixin({
		mixin: {
			tagName: 'td',
			classes: [ 'dgrid-cell' ],
			getChildrenNodes(this: DgridCell): DNode[] {
				const { properties: { data } } = this;
				return [ data ? data.toString() : null ];
			}
		}
	});

export default createDgridCell;
