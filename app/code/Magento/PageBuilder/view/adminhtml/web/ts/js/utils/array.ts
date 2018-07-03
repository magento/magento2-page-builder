/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * Move an array item within the current array
 *
 * @param array
 * @param fromIndex
 * @param toIndex
 * @returns {Array<any>}
 */
export function moveArrayItem(
    array: any[] | KnockoutObservableArray <any>,
    fromIndex: number,
    toIndex: number,
): any[] | KnockoutObservableArray <any> {
    array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
    return array;
}

/**
 * Move an array item from one array into another
 *
 * @param item
 * @param array
 * @param toIndex
 * @returns {Array<any>}
 */
export function moveArrayItemIntoArray(
    item: any,
    array: any[] | KnockoutObservableArray <any>,
    toIndex: number,
): any[] | KnockoutObservableArray <any> {
    array.splice(toIndex, 0, item);
    return array;
}

/**
 * Remove an array item
 *
 * @param array
 * @param item
 * @returns {Array<any>}
 */
export function removeArrayItem(
    array: any[] | KnockoutObservableArray <any>,
    item: any,
): any[] | KnockoutObservableArray <any> {
    const index = array.indexOf(item);

    if (index > -1) {
        array.splice(index, 1);
    }

    return array;
}

/**
 * Search outwards from an array item until a callback matches
 *
 * @author https://github.com/thejameskyle/outward-search
 *
 * @param {any[]} items
 * @param {number} start
 * @param {(item: any, index: number) => boolean} callback
 * @returns {any}
 * @api
 */
export function outwardSearch(
    items: any[],
    start: number,
    callback: (item: any, index: number) => boolean,
) {
    if (!items.length) {
        return null;
    }

    if (start < 0 || start > items.length - 1) {
        throw new TypeError("starting index must be within bounds of array");
    }

    const max = items.length - 1;
    let low = start;
    let high = start + 1;

    while (true) {
        const hitMin = low < 0;
        const hitMax = high > max;

        if (hitMin && hitMax) {
            break;
        }

        if (!hitMin) {
            const item = items[low];
            const result = callback(item, low);
            if (!!result) {
                return item;
            }
            low--;
        }

        if (!hitMax) {
            const item = items[high];
            const result = callback(item, high);
            if (!!result) {
                return item;
            }
            high++;
        }
    }

    return null;
}
