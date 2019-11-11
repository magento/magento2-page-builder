/*eslint-disable */
/* jscs:disable */

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

define(["Magento_PageBuilder/js/content-type-menu/option"], function (_option) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var TitleOption =
  /*#__PURE__*/
  function (_option2) {
    "use strict";

    _inheritsLoose(TitleOption, _option2);

    /**
     * @param {OptionConfigInterface} options
     */
    function TitleOption(options) {
      var _this;

      _this = _option2.call(this, options) || this; // Modify the icon when changes are made to display in the data store

      _this.preview.displayLabel.subscribe(function (label) {
        _this.title(label);
      });

      return _this;
    }

    return TitleOption;
  }(_option);

  return TitleOption;
});
//# sourceMappingURL=title-option.js.map