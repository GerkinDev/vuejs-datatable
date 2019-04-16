import { Component, Provide, Vue } from 'vue-property-decorator';

import { TableType } from '../../classes';

export interface ITableTypeConsumer extends Vue {
	readonly tableType: TableType<any>;
}

export const tableTypeConsumerFactory = ( tableType: TableType<any> ): typeof Vue & ( new() => ITableTypeConsumer ) => {
	@Component
	class TableTypeConsumer extends Vue implements ITableTypeConsumer {
		@Provide( 'table-type' )
		public get tableType() {
			return tableType;
		}
	}
	return TableTypeConsumer;
};
