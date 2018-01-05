/*eslint-disable */
define([], function () {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  'use strict';

  var Option =
  /*#__PURE__*/
  function () {
    /**
     * Option constructor
     *
     * @param parent
     * @param code
     * @param icon
     * @param title
     * @param action
     * @param classes
     * @param sort
     * @param template
     */
    function Option(parent, code, icon, title, action, classes, sort, template) {
      this.parent = void 0;
      this.code = void 0;
      this.icon = void 0;
      this.title = void 0;
      this.action = false;
      this.classes = void 0;
      this.sort = void 0;
      this._template = void 0;
      this.parent = parent;
      this.code = code;
      this.icon = icon;
      this.title = title;
      this.action = action;
      this.classes = classes.join(' ');
      this.sort = sort;
      this._template = template;
    }

    _createClass(Option, [{
      key: "template",
      get: function get() {
        return this._template || null;
      }
    }]);

    return Option;
  }();

  return {
    Option: Option
  };
});
//# sourceMappingURL=option.js.map
