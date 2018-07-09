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
     * @param value string
     * @returns {string | object}
     */
    fromDom(value: string): string | object;

    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {string | object}
     */
    toDom(name: string, data: DataObject): string | object;
}

export default ConverterInterface;
