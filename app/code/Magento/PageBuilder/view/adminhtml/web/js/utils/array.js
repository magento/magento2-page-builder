/*eslint-disable */
/* jscs:disable */
define([], function () {
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
  function moveArrayItem(array, fromIndex, toIndex) {
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


  function moveArrayItemIntoArray(item, array, toIndex) {
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


  function removeArrayItem(array, item) {
    var index = array.indexOf(item);

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


  function outwardSearch(items, start, callback) {
    if (!items.length) {
      return null;
    }

    if (start < 0 || start > items.length - 1) {
      throw new TypeError("starting index must be within bounds of array");
    }

    var max = items.length - 1;
    var low = start;
    var high = start + 1;

    while (true) {
      var hitMin = low < 0;
      var hitMax = high > max;

      if (hitMin && hitMax) {
        break;
      }

      if (!hitMin) {
        var _item = items[low];
        var result = callback(_item, low);

        if (!!result) {
          return _item;
        }

        low--;
      }

      if (!hitMax) {
        var _item2 = items[high];

        var _result = callback(_item2, high);

        if (!!_result) {
          return _item2;
        }

        high++;
      }
    }

    return null;
  }

  return {
    moveArrayItem: moveArrayItem,
    moveArrayItemIntoArray: moveArrayItemIntoArray,
    removeArrayItem: removeArrayItem,
    outwardSearch: outwardSearch
  };
});
//# sourceMappingURL=array.js.map