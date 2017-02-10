import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { PropertiesChangeEvent, WidgetProperties, Constructor } from '@dojo/widget-core/interfaces';
import { DataProvider, ObserverPayload } from './../providers/interfaces';

export interface DataProviderMixinProperties {
	dataProvider: DataProvider<any, any>;
}

export interface DataProviderInterface {
	data: ObserverPayload<any, any>;
}

export function DataProviderMixin<T extends Constructor<WidgetBase<WidgetProperties>>>(base: T): T & Constructor<DataProviderInterface> {

	return class extends base {
		properties: DataProviderMixinProperties;
		private _data: ObserverPayload<any, any>;

		constructor(...args: any[]) {
			super(...args);
			this._data = {
				totalCount: 0,
				state: <any> {},
				items: []
			};

			this.own(this.on('properties:changed', (evt: PropertiesChangeEvent<this, DataProviderMixinProperties>) => {
				if (evt.changedPropertyKeys.indexOf('dataProvider') !== -1) {
					this.wire();
				}
			}));

			this.wire();
		}

		public get data(): ObserverPayload<any, any> {
			return this._data;
		}

		private wire() {

			if (!this.properties.dataProvider) {
				return;
			}

			this.properties.dataProvider.observe().subscribe((data) => {
				this._data = data;
				this.invalidate();
			});
		}
	};
}
