/*eslint-disable */

define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var AppearanceApplier =
  /*#__PURE__*/
  function () {
    // List of type appearances
    function AppearanceApplier(appearances) {
      this.appearances = void 0;
      this.appearances = appearances;
    }
    /**
     * @param data
     * @returns {DataObject}
     */


    var _proto = AppearanceApplier.prototype;

    _proto.apply = function apply(data) {
      if (data['appearance'] !== undefined) {
        if (this.appearances[data['appearance']] === undefined) {
          console.error('No appearances specified for content type.');
        }

        return this.appearances[data['appearance']].apply(data);
      }

      return data;
    };

    return AppearanceApplier;
  }();

  return AppearanceApplier;
});
//# sourceMappingURL=appearance-applier.js.map
