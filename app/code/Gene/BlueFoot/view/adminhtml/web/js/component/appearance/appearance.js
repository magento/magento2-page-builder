define([], function () {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /*eslint-disable */
  var Appearance =
  /*#__PURE__*/
  function () {
    // List of type appearances
    function Appearance(appearances) {
      this.appearances = void 0;
      this.appearances = appearances;
    }
    /**
     * @param data
     * @returns {DataObject}
     */


    var _proto = Appearance.prototype;

    _proto.add = function add(data) {
      if (data['appearance'] !== undefined) {
        if (this.appearances[data['appearance']] === undefined) {
          console.error('No appearances specified for content type.');
        }

        return this.appearances[data['appearance']].add(data);
      }

      return data;
    };

    return Appearance;
  }();

  return Appearance;
});
//# sourceMappingURL=appearance.js.map
