import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import ThemedMixin, { theme } from '@dojo/widget-core/mixins/Themed';
import { DNode } from '@dojo/widget-core/interfaces';

import * as css from './styles/Footer.m.css';

export interface FooterProperties {
	total?: number;
	page: number;
	pageSize: number;
}

@theme(css)
export default class Footer extends ThemedMixin(WidgetBase)<FooterProperties> {
	protected render(): DNode {
		const { total, page, pageSize } = this.properties;
		const footer =
			total !== undefined
				? `Page ${page} of ${Math.ceil(total / pageSize)}. Total rows ${total}`
				: `Page ${page} of ?`;
		return v('div', { classes: css.root }, [footer]);
	}
}
