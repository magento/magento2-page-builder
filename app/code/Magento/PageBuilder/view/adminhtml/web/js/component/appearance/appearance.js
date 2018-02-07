/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Appearance =
  /*#__PURE__*/
  function () {
    // List of type appearances
    function Appearance(appearances) {
      this.appearances = void 0;
      this.appearances = appearances;
    }
    /**
     * Does the instance and data have an appearance to apply?
     *
     * @param {} data
     * @returns {boolean}
     */


    var _proto = Appearance.prototype;

    _proto.hasAppearances = function hasAppearances(data) {
      return typeof this.appearances[data.appearance] !== "undefined";
    };
    /**
     * @param data
     * @returns {DataObject}
     */


    _proto.add = function add(data) {
      if (data.appearance !== undefined) {
        if (!this.hasAppearances(data)) {
          console.error("No appearances specified for content type.");
        }

        return this.appearances[data.appearance].add(data);
      }

      return data;
    };

    return Appearance;
  }();

  return Appearance;
});
//# sourceMappingURL=appearance.js.map
