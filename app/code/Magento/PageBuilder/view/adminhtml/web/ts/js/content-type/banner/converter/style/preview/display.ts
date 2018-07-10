/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ConverterInterface from "../../../../../converter/converter-interface";
import {DataObject} from "../../../../../data-store";

export default class Display implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {void}
     */
    public fromDom(value: string): void {
        return;
    }

    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data DataObject
     * @returns {void}
     */
    public toDom(name: string, data: DataObject): void {
        return;
    }
}
