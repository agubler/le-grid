import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v } from '@dojo/framework/widget-core/d';
import ThemedMixin, { theme } from '@dojo/framework/widget-core/mixins/Themed';
import { DNode } from '@dojo/framework/widget-core/interfaces';
import * as css from './styles/PlaceholderRow.m.css';

@theme(css)
export default class PlaceholderRow extends ThemedMixin(WidgetBase) {
	protected render(): DNode {
		return v('div', { classes: css.root }, [v('div', { classes: css.loading })]);
	}
}
