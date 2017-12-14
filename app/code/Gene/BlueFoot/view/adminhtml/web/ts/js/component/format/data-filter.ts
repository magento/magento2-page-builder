/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import {DataObject} from "../data-store";
import {DataFilterInterface} from "./data-filter.d";

export default class DataFilter implements DataFilterInterface {
    allowedAttributes: DataObject;

    /**
     * Create a mapping of strings to booleans
     *
     * @param array
     * @returns {DataObject}
     */
    toDataObject(array: Array<string>): DataObject {
        return array.reduce((acc: any, next: string) => {
            acc[next] = true;
            return acc;
        }, {})
    }

    /**
     * Filters attributes in a DataObject
     *
     * @param data
     * @param attributes
     * @returns {DataObject}
     */
    filterAttributes(data: DataObject): DataObject {
        let result: DataObject = {};
        for (let key in data) {
            if (this.allowedAttributes[key]) {
                result[key] = data[key];
            }
        }
        return result;
    }

    /**
     * Filter allowed attributes from object
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    filter(data: DataObject): DataObject {
        return this.filterAttributes(data)
    }
}