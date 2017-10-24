/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export default class AttributeMapper {
    /**
     * Map attribute keys to DOM key names and normalize values
     *
     * @param object
     * @returns {any}
     */
    toDom(object) {
        let result: any = {};
        Object.keys(object).map(
            function (key: string) {
                let value = object[key];
                if (key === 'role' || key === 'name') {
                    key = 'data-role';
                }
                if (key === 'appearance') {
                    key = 'data-appearance';
                }
                result[key.replace('_', '-')] = value;
            }.bind(this)
        );
        return result;
    }
}