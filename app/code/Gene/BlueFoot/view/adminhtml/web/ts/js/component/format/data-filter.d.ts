/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import {DataObject} from "../data-store";

export interface DataFilterInterface {
    allowedAttributes: DataObject;

    filter(data: DataObject): DataObject;
}