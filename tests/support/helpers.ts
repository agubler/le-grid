import { Constructor, WidgetMetaBase, WidgetMetaConstructor } from '@dojo/widget-core/interfaces';
import { SinonStub } from 'sinon';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';

export function MockMetaMixin<T extends Constructor<WidgetBase<any>>>(Base: T, mockStub: SinonStub): T {
	return class extends Base {
		protected meta<T extends WidgetMetaBase>(MetaType: WidgetMetaConstructor<T>): T {
			return mockStub(MetaType);
		}
	};
}
