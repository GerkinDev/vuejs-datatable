import { Vue } from 'vue-property-decorator';
import { TableType } from '../../classes';
export interface ITableTypeConsumer extends Vue {
    readonly tableType: TableType<any>;
}
export declare const tableTypeConsumerFactory: (tableType: TableType<any, any[], any[], any[], any[]>) => import("vue").VueConstructor<Vue> & (new () => ITableTypeConsumer);
