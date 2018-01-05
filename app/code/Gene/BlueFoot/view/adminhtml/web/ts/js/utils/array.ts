/**
 * Move an array item within the current array
 *
 * @param array
 * @param fromIndex
 * @param toIndex
 * @returns {Array<any>}
 */

export function moveArrayItem(array: Array<any> | KnockoutObservableArray<any>, fromIndex: number, toIndex: number): Array<any> | KnockoutObservableArray<any> {
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
export function moveArrayItemIntoArray(item: any, array: Array<any> | KnockoutObservableArray<any>, toIndex: number): Array<any> | KnockoutObservableArray<any> {
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
export function removeArrayItem(array: Array<any> | KnockoutObservableArray<any>, item: any): Array<any> | KnockoutObservableArray<any> {
    let index = array.indexOf(item);

    if (~index) {
        array.splice(index, 1);
    }

    return array;
}