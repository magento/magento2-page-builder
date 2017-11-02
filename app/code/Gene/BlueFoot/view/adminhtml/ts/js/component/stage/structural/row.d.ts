/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import { Structural } from './abstract.d';
import { ColumnInterface } from './column.d';

interface RowInterface extends Structural {
    addColumn(data?: object): ColumnInterface
}