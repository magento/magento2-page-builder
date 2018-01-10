/*eslint-disable */
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

  return {
    moveArrayItem: moveArrayItem,
    moveArrayItemIntoArray: moveArrayItemIntoArray,
    removeArrayItem: removeArrayItem
  };
});
//# sourceMappingURL=array.js.map
