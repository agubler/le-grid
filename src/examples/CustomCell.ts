import { assign } from '@dojo/core/lang';
import { isHNode } from '@dojo/widget-core/d';

import GridCell from './../GridCell';

export default class CustomCell extends GridCell {
	render() {
		let result = super.render();
		if (isHNode(result)) {
			const customClass = !!Math.round(Math.random()) ? { 'custom-cell': true } : { 'custom-cell': false };
			assign(<any> result.properties.classes, customClass);
		}
		return result;
	}
}
