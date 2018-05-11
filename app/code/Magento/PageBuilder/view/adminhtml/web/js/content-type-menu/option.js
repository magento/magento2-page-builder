/*eslint-disable */
define([], function () {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Option =
  /*#__PURE__*/
  function () {
    /**
     * @param parent
     * @param code
     * @param icon
     * @param title
     * @param action
     * @param classes
     * @param sort
     * @param optionTemplate
     */
    function Option(parent, code, icon, title, action, classes, sort, optionTemplate) {
      this.classes = void 0;
      this.code = void 0;
      this.icon = void 0;
      this.parent = void 0;
      this.sort = void 0;
      this.title = void 0;
      this.action = void 0;
      this.optionTemplate = void 0;
      this.parent = parent;
      this.code = code;
      this.icon = icon;
      this.title = title;

      if (action) {
        this.action = action;
      } else {
        this.action = function () {
          return;
        };
      }

      this.classes = classes.join(" ");
      this.sort = sort;
      this.optionTemplate = optionTemplate;
    }

    _createClass(Option, [{
      key: "template",
      get: function get() {
        return this.optionTemplate || null;
      }
    }]);

    return Option;
  }();

  return Option;
});
//# sourceMappingURL=option.js.map
