/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import { Structural } from './abstract.d';

interface ColumnInterface extends Structural {
    columnDefinition: KnockoutObservable<object>;

    addColumn(data?: object): ColumnInterface
}