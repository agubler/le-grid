import compose, { ComposeFactory } from '@dojo/compose/compose';
import { PropertiesChangeEvent } from '@dojo/widget-core/interfaces';
import { DataProvider, BaseItem } from './../providers/interfaces';

export interface DataProviderMixinProperties {
	dataProvider: DataProvider<any, any>;
}

export interface DataProviderOptions {
	properties: DataProviderMixinProperties;
}

export interface DataProviderMixin {
	readonly data: any;
	readonly properties: DataProviderMixinProperties;
	invalidate(): void;
}

export interface DataProviderMixinFactory extends ComposeFactory<DataProviderMixin, DataProviderOptions> {}

interface InternalState {
	dataProvider?: DataProvider<any, any>;
}

const dataMap = new Map<DataProviderMixin, BaseItem | BaseItem[]>();

const internalStateMap = new Map<DataProviderMixin, InternalState>();

function replaceLocalData(instance: DataProviderMixin, data: any) {
	dataMap.set(instance, data);
	instance.invalidate();
}

function wire(instance: DataProviderMixin) {
	const { dataProvider } = instance.properties;

	if (!dataProvider) {
		return;
	}

	dataProvider.observe().subscribe((data) => {
		replaceLocalData(instance, data);
	});

	// TODO handle destruction
}

const dataProviderFactory: DataProviderMixinFactory = compose({
		get data(this: DataProviderMixin): any {
			return dataMap.get(this);
		}
	})
	.mixin({
		initialize(instance: any, options: DataProviderOptions) {
			const { properties: { dataProvider } } = options;

			instance.own(instance.on('properties:changed', (evt: PropertiesChangeEvent<any, DataProviderMixinProperties>) => {
				if (evt.changedPropertyKeys.indexOf('dataProvider') !== -1) {
					wire(instance);
				}
			}));

			internalStateMap.set(instance, { dataProvider });
			wire(instance);
		}
	});

export default dataProviderFactory;
