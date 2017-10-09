import { Structural } from './abstract.d';
import { ColumnInterface } from './column.d';

/**
 * RowInterface Interface
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
interface RowInterface extends Structural {
    addColumn(data?: object): ColumnInterface
}