/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../../../data-store";
import ConverterInterface from "../../converter-interface";

/**
 * @api
 */
export default class CreateValueForStoreId implements ConverterInterface {

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        return value;
    }

    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string}
     */
    public toDom(name: string, data: DataObject): string {
        if (typeof data[name] !== "string") {
            return "";
        }

        return (data[name] as string).replace(/\}\}$/, " store_id=\"0\"}}");
    }
}
