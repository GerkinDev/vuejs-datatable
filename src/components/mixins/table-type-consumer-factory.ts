import { Component, Provide, Vue } from 'vue-property-decorator';

import { TableType } from '../../classes';

export interface ITableTypeConsumer extends Vue {
	readonly tableType: TableType<any>;
}

export const tableTypeConsumerFactory = ( tableType: TableType<any> ): typeof Vue & ( new() => ITableTypeConsumer ) => {
	/**
	 * This mixin provide a [[TableType]] to inner components, which allow them to access [[Settings]] (through [[TableType.setting]])
	 */
	@Component
	class TableTypeConsumer extends Vue implements ITableTypeConsumer {
		/**
		 * Provide the current [[TableType]] to inner components.
		 *
		 * @vue Provide `table-type`
		 */
		@Provide( 'table-type' )
		public get tableType() {
			return tableType;
		}
	}
	return TableTypeConsumer;
};
