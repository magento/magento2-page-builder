/*eslint-disable */
/* jscs:disable */
define(["knockout", "Magento_PageBuilder/js/utils/array"], function (_knockout, _array) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Collection =
  /*#__PURE__*/
  function () {
    "use strict";

    function Collection(children) {
      this.children = children ? children : _knockout.observableArray([]);
    }
    /**
     * Return the children of the current element
     *
     * @returns {KnockoutObservableArray<ContentTypeInterface | ContentTypeCollectionInterface>}
     */


    var _proto = Collection.prototype;

    _proto.getChildren = function getChildren() {
      return this.children;
    }
    /**
     * Add a child into the observable array
     *
     * @param child
     * @param index
     */
    ;

    _proto.addChild = function addChild(child, index) {
      if (typeof index === "number") {
        // Use the arrayUtil function to add the item in the correct place within the array
        (0, _array.moveArrayItemIntoArray)(child, this.children, index);
      } else {
        this.children.push(child);
      }
    }
    /**
     * Remove a child from the observable array
     *
     * @param child
     */
    ;

    _proto.removeChild = function removeChild(child) {
      (0, _array.removeArrayItem)(this.children, child);
    }
    /**
     * Set the children observable array into the class
     *
     * @param children
     */
    ;

    _proto.setChildren = function setChildren(children) {
      this.children = children;
    };

    return Collection;
  }();

  return Collection;
});
//# sourceMappingURL=collection.js.map