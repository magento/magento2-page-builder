import { Structural } from './abstract.d';

/**
 * ColumnInterface Interface
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
interface ColumnInterface extends Structural {
    columnDefinition: KnockoutObservable<object>;

    addColumn(data?: object): ColumnInterface
}