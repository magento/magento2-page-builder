/**
 * - Common.js
 * Common functions required in more than one file
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'ko',
    'mageUtils'
], function (ko, utils) {

    return {
        /**
         * Move an array item within an array based on indexes
         *
         * @param array
         * @param fromIndex
         * @param toIndex
         */
        moveArrayItem: function (array, fromIndex, toIndex) {
            array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
            return array;
        },

        /**
         * Move an item into a different array
         *
         * @param item
         * @param array
         * @param toIndex
         * @returns {*}
         */
        moveArrayItemIntoArray: function (item, array, toIndex) {
            array.splice(toIndex, 0, item);
            return array;
        }
    }
});