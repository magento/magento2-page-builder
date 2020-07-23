/*eslint-disable */
/* jscs:disable */

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

define(["Magento_PageBuilder/js/content-type/master"], function (_master) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var MasterCollection =
  /*#__PURE__*/
  function (_master2) {
    "use strict";

    _inheritsLoose(MasterCollection, _master2);

    function MasterCollection() {
      return _master2.apply(this, arguments) || this;
    }

    _createClass(MasterCollection, [{
      key: "masterTemplate",

      /**
       * Retrieve the child template
       *
       * @returns {string}
       */
      get: function get() {
        return "Magento_PageBuilder/content-type/master-collection";
      }
    }]);

    return MasterCollection;
  }(_master);

  return MasterCollection;
});
//# sourceMappingURL=master-collection.js.map