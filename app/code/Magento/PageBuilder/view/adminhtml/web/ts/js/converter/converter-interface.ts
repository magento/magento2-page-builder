/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../data-store";

/**
 * @api
 */
interface ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param {any} value
     * @returns {any}
     */
    fromDom(value: any): any;

    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {any}
     */
    toDom(name: string, data: DataObject): any;
}

export default ConverterInterface;
