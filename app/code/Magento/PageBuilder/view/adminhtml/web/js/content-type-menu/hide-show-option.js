/*eslint-disable */
/* jscs:disable */

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

define(["mage/translate", "Magento_PageBuilder/js/content-type-menu/option"], function (_translate, _option) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var HideShowOption = /*#__PURE__*/function (_option2) {
    "use strict";

    _inheritsLoose(HideShowOption, _option2);

    /**
     * @param {OptionConfigInterface} options
     */
    function HideShowOption(options) {
      var _this;

      _this = _option2.call(this, options) || this; // Modify the icon when changes are made to display in the data store

      _this.preview.contentType.dataStore.subscribe(_this.onDisplayChange.bind(_assertThisInitialized(_this)), "display");

      return _this;
    }
    /**
     * On display change update the title and icon
     *
     * @param {DataObject} state
     */


    var _proto = HideShowOption.prototype;

    _proto.onDisplayChange = function onDisplayChange(state) {
      var display = !!state.display;

      if (display) {
        this.icon(HideShowOption.hideIcon);
        this.title(HideShowOption.hideText);
      } else {
        this.icon(HideShowOption.showIcon);
        this.title(HideShowOption.showText);
      }
    };

    return HideShowOption;
  }(_option);

  HideShowOption.showText = (0, _translate)("Show");
  HideShowOption.showIcon = "<i class='icon-pagebuilder-show'></i>";
  HideShowOption.hideText = (0, _translate)("Hide");
  HideShowOption.hideIcon = "<i class='icon-pagebuilder-hide'></i>";
  return HideShowOption;
});
//# sourceMappingURL=hide-show-option.js.map