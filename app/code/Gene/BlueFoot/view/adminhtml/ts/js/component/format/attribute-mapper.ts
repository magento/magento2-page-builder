/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import {DataObject} from "../data-store";

export default class AttributeMapper {
    // Attribute name mapping
    attributeNameMapping: DataObject = {
        name: 'data-role',
        appearance: 'data-appearance',
        identifier: 'data-identifier',
        button_text: 'data-button-text',
        label_text: 'data-label-text',
        placeholder: 'data-placeholder',
        title: 'data-title',
        view_mode: 'data-view-mode',
        sku: 'data-sku',
        src: 'src'
    };

    /**
     * Map attribute keys to DOM key names and normalize values
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    toDom(data: DataObject): DataObject {
        let result: DataObject = {};
        Object.keys(data).map(
            (key: string) => {
                let value = data[key];
                if (key in this.attributeNameMapping) {
                    key = this.attributeNameMapping[key];
                }
                result[key.replace('_', '-')] = value;
            }
        );
        return result;
    }

    /**
     * Convert attributes from the DOM into the data store
     * @param {} data
     * @returns {}
     */
    fromDom(data: DataObject): DataObject {
        // Flip the object key / values
        let attributeMapping = Object.keys(this.attributeNameMapping).reduce((obj: DataObject, key) => {
            obj[this.attributeNameMapping[key]] = key;
            return obj;
        }, {}),
            result: DataObject = {};
        Object.keys(data).map(
            (key: string) => {
                if (key in attributeMapping) {
                    result[attributeMapping[key]] = data[key];
                }
            }
        );
        return result;
    }
}
