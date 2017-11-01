/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import {DataObject} from "../component/data-store";

export default class AttributeFilter {
    // Allowed attributes
    allowAttributes: Array<string> = ['name', 'appearance'];

    /**
     * Filter allowed attributes from object
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    filter(data: DataObject): DataObject {
        let attributes: DataObject = {};
        Object.keys(data).map(
            function (key: string) {
                if (this.allowAttributes.includes(key)) {
                    attributes[key] = data[key];
                }
            }.bind(this)
        );
        return attributes;
    }
}
