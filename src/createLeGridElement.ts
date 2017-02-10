import LeGrid from './LeGrid';
import ArrayDataProvider from './providers/ArrayDataProvider';
import { CustomElementDescriptor } from '@dojo/widget-core/customElements';

export default function createCallToActionElementDescriptor(): CustomElementDescriptor {
	return {
		tagName: 'le-grid',
		widgetFactory: LeGrid,
		properties: [
		{
			propertyName: 'dataProvider'
		},
		{
			propertyName: 'columns'
		},
		{
			propertyName: 'pagination'
		},
		{
			propertyName: 'ArrayDataProvider',
			getValue: () => ArrayDataProvider
		}],
		initialization(this: any, properties: any) {
			properties.dataProvider = new ArrayDataProvider();
		}
	};
};
