import '../helpers/wait-for-update.js';

import TableTest from './components/table.js';
import PagerTest from './components/pager.js';
import HeaderCellTest from './components/header-cell.js';
import CellTest from './components/cell.js';
import ButtonTest from './components/pager-button.js';

describe('Datatable', TableTest);
describe('DatatablePager', PagerTest);
describe('DatatableHeaderCell', HeaderCellTest);
describe('DatatableCell', CellTest);
describe('DatatablePagerButton', ButtonTest);

import ColumnTest from './classes/column.js';
import HandlerTest from './classes/handler.js';
import SettingsTest from './classes/settings.js';
import FactoryTest from './classes/factory.js';
import TableTypeTest from './classes/table-type.js';

describe('Column', ColumnTest);
describe('Handler', HandlerTest);
describe('Settings', SettingsTest);
describe('Factory', FactoryTest);
describe('TableType', TableTypeTest);
