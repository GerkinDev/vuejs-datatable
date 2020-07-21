import { Component, Provide, Vue } from 'vue-property-decorator';

import { TableType } from '../../classes';

/**
 * This interface describes a component from which the [[tableType]] can be accessed.
 */
export interface ITableTypeConsumer extends Vue {
	/** Property containing the TableType used by this component. */
	readonly tableType: TableType<any>;
}

/** @ignore */
export const tableTypeConsumerFactory = <TTableType extends TableType<any, any, any, any, any>>( tableType: TTableType ): typeof Vue & ( new() => ITableTypeConsumer ) => {
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
