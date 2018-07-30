/*eslint-disable */
define([], function () {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var TitleOption =
  /*#__PURE__*/
  function () {
    /**
     * @param {Preview} parent
     * @param {string} name
     * @param {number} sort
     */
    function TitleOption(parent, name, sort) {
      this.parent = void 0;
      this.name = void 0;
      this.sort = void 0;
      this.code = void 0;
      this.parent = parent;
      this.name = name;
      this.sort = sort;
      this.code = "title";
    }

    var _proto = TitleOption.prototype;

    /**
     * Bind events for the option menu item
     */
    _proto.bindEvents = function bindEvents() {// Bind any events required by the option menu item
    };

    _createClass(TitleOption, [{
      key: "template",
      get: function get() {
        return "Magento_PageBuilder/content-type/title";
      }
    }]);

    return TitleOption;
  }();

  return TitleOption;
});
//# sourceMappingURL=title.js.map
