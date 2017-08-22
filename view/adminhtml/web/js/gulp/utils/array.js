define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Move an array item within the current array
     *
     * @param array
     * @param fromIndex
     * @param toIndex
     * @returns {Array<any>}
     */
    function moveArrayItem(array, fromIndex, toIndex) {
        array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
        return array;
    }
    exports.moveArrayItem = moveArrayItem;
    /**
     * Move an array item from one array into another
     *
     * @param item
     * @param array
     * @param toIndex
     * @returns {Array<any>}
     */
    function moveArrayItemIntoArray(item, array, toIndex) {
        array.splice(toIndex, 0, item);
        return array;
    }
    exports.moveArrayItemIntoArray = moveArrayItemIntoArray;
    /**
     * Remove an array item
     *
     * @param array
     * @param item
     * @returns {Array<any>}
     */
    function removeArrayItem(array, item) {
        var index = array.indexOf(item);
        if (~index) {
            array.splice(index, 1);
        }
        return array;
    }
    exports.removeArrayItem = removeArrayItem;
});
