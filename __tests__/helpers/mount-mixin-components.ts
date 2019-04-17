import { mount, shallowMount, ThisTypedMountOptions } from '@vue/test-utils';
import { Mixins, Vue } from 'vue-property-decorator';

import { ITableTypeConsumer, tableTypeConsumerFactory } from '../../src/components/mixins/table-type-consumer-factory';
import { VueDatatablePager } from '../../src/components/vue-datatable-pager/vue-datatable-pager';
import { TableType } from './../../src/classes/table-type';
import { VueDatatable } from '../../src/components/vue-datatable/vue-datatable';

export const mountVueDatatablePager = (
	mountShallow: boolean,
	tableType: TableType<any>,
	mountOptions: ThisTypedMountOptions<VueDatatablePager<VueDatatablePager<any>> & ITableTypeConsumer & Vue>,
) =>
	( mountShallow ? shallowMount : mount )( Mixins( VueDatatablePager, tableTypeConsumerFactory( tableType ) ), mountOptions );

export const mountVueDatatable = (
	mountShallow: boolean,
	tableType: TableType<any>,
	mountOptions: ThisTypedMountOptions<VueDatatable<any, VueDatatable<any, any>> & ITableTypeConsumer & Vue>,
) => ( mountShallow ? shallowMount : mount )( Mixins( VueDatatable, tableTypeConsumerFactory( tableType ) ), mountOptions );
