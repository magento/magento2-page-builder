/*eslint-disable */
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

define(["knockout", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/content-type/preview"], function (_knockout, _events, _preview) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Preview =
  /*#__PURE__*/
  function (_preview2) {
    "use strict";

    _inheritsLoose(Preview, _preview2);

    function Preview() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _preview2.call.apply(_preview2, [this].concat(args)) || this;
      _this.displayPreview = _knockout.observable(false);
      return _this;
    }

    var _proto = Preview.prototype;

    /**
     * Bind events
     */

    /**
     * Open edit menu on video content type drop with a delay of 300ms
     */
    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _preview2.prototype.bindEvents.call(this); // When a map is dropped for the first time open the edit panel


      _events.on("video:dropAfter", function (args) {
        if (args.id === _this2.parent.id) {
          setTimeout(function () {
            _this2.openEdit();
          }, 300);
        }
      });
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
