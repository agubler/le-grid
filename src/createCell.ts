import { Widget, WidgetMixin, WidgetProperties, WidgetFactory, DNode } from '@dojo/widgets/interfaces';
import createWidgetBase from '@dojo/widgets/createWidgetBase';

export interface DgridCellProperties extends WidgetProperties {
	data: string;
}

export interface DgridCellMixin extends WidgetMixin<DgridCellProperties> { }

export type DgridCell = Widget<DgridCellProperties> & DgridCellMixin

export interface DgridCellFactory extends WidgetFactory<DgridCell, DgridCellProperties> { }

const createDgridCell: DgridCellFactory = createWidgetBase
	.mixin({
		mixin: {
			tagName: 'td',
			classes: [ 'dgrid-cell' ],
			getChildrenNodes(this: DgridCell): DNode[] {
				const { properties: { data, renderer } } = this;
				const value = renderer ? renderer(data) : data;
				return [ value ? value.toString() : null ];
			}
		}
	});

export default createDgridCell;
