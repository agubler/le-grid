import compose, { ComposeFactory } from '@dojo/compose/compose';
import { VNodeProperties } from '@dojo/interfaces/vdom';
import { assign } from '@dojo/core/lang';

export interface OuterNodeThemeMixin {
	getOuterNodeThemes(): {}[];
}

export type OuterNodeTheme = OuterNodeThemeMixin & {
	theme: any;
}

export interface GridBodyFactory extends ComposeFactory<{}, {}> { }

const outerNodeTheme: GridBodyFactory = compose({
}).mixin({
	aspectAdvice: {
		after: {
			getNodeAttributes(this: OuterNodeTheme, results: VNodeProperties) {
				const themes = this.getOuterNodeThemes() || [];
				const classes = {
					...results.classes,
					...themes.reduce((classes, item) => { return { ...classes, ...item }; }, {})
				};
				return assign(results, { classes });
			}
		}
	}
});

export default outerNodeTheme;
