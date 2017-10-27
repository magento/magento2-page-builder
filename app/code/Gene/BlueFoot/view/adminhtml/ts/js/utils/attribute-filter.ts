/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import {DataObject} from "../component/data-store";

export default class AttributeFilter {
    /**
     * Filter allowed attributes from object
     *
     * @param data
     * @returns {object}
     */
    filter(data: DataObject): object {
        let attributes: any = {};
        const allowAttributes = [
            'role',
            'name',
            'appearance'
        ];
        Object.keys(data).map(
            function (key: any) {
                if (allowAttributes.includes(key)) {
                    attributes[key] = data[key];
                }
            }
        );
        return attributes;
    }
}
