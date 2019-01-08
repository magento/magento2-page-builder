/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * Retrieve a value within an object using a dot notation
 *
 * Original source from https://github.com/NarHakobyan/underscore.get
 *
 * @param {{}} obj
 * @param {string} desc
 * @param value
 * @returns {any}
 */
export default function get(obj: {[key: string]: any}, desc: string, value?: any) {
    const arr = desc ? desc.split(".") : [];

    while (arr.length && obj) {
        const comp = arr.shift();
        const match = /(.+)\[([0-9]*)\]/.exec(comp);

        // handle arrays
        if ((match !== null) && (match.length === 3)) {
            const arrayData = {
                arrName: match[1],
                arrIndex: match[2],
            };
            if (obj[arrayData.arrName] !== undefined) {
                obj = obj[arrayData.arrName][arrayData.arrIndex];
            } else {
                obj = undefined;
            }

            continue;
        }

        obj = obj[comp];
    }

    if (typeof value !== "undefined") {
        if (obj === undefined) {
            return value;
        }
    }

    return obj;
}
