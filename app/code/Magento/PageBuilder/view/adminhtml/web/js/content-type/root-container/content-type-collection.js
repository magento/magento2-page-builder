/*eslint-disable */
/* jscs:disable */

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

define(["Magento_Ui/js/modal/alert", "Magento_PageBuilder/js/content-type-collection"], function (_alert, _contentTypeCollection) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var RootContainer = /*#__PURE__*/function (_contentTypeCollectio) {
    "use strict";

    _inheritsLoose(RootContainer, _contentTypeCollectio);

    function RootContainer() {
      return _contentTypeCollectio.apply(this, arguments) || this;
    }

    var _proto = RootContainer.prototype;

    /**
     * Remove a child from the observable array
     *
     * @param child
     */
    _proto.removeChild = function removeChild(child) {
      if (this.getChildren().length === 1) {
        (0, _alert)({
          content: $t("You are not able to remove the final row from the content."),
          title: $t("Unable to Remove")
        });
        return;
      }

      _contentTypeCollectio.prototype.removeChild.call(this, child);
    };

    return RootContainer;
  }(_contentTypeCollection);

  return RootContainer;
});
//# sourceMappingURL=content-type-collection.js.map