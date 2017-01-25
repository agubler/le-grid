import compose, { ComposeFactory } from '@dojo/compose/compose';
import { VNodeProperties } from '@dojo/interfaces/vdom';
import { assign } from '@dojo/core/lang';

export interface OuterNodeThemeMixin {
	getOuterNodeThemes(): {}[];
}

export type OuterNodeTheme = OuterNodeThemeMixin & {
	theme: any;
}

export interface GridBodyFactory extends ComposeFactory<OuterNodeThemeMixin, {}> { }

const outerNodeTheme: GridBodyFactory = compose({
	getOuterNodeThemes(): Object[] {
		return [];
	}
}).mixin({
	aspectAdvice: {
		after: {
			getNodeAttributes(this: OuterNodeTheme, results: VNodeProperties) {
				const classes = {
					...results.classes,
					...this.getOuterNodeThemes().reduce((classes, item) => { return { ...classes, ...item }; }, {})
				};
				return assign(results, { classes });
			}
		}
	}
});

export default outerNodeTheme;
