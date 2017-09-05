/**
 * Move an array item within the current array
 *
 * @param array
 * @param fromIndex
 * @param toIndex
 * @returns {Array<any>}
 */
export function moveArrayItem(array, fromIndex, toIndex) {
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
export function moveArrayItemIntoArray(item, array, toIndex) {
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
export function removeArrayItem(array, item) {
    let index = array.indexOf(item);
    if (~index) {
        array.splice(index, 1);
    }
    return array;
}
