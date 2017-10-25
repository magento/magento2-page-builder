define([], function () {
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Heading =
  /*#__PURE__*/
  function () {
    function Heading() {
      _classCallCheck(this, Heading);
    }

    _createClass(Heading, [{
      key: "read",

      /**
       * Read heading type and title from the element
       *
       * @param element
       * @returns {object}
       */
      value: function read(element) {
        return {
          'heading_type': element.nodeName,
          'title': element.innerText
        };
      }
    }]);

    return Heading;
  }();

  return Heading;
});
//# sourceMappingURL=heading.js.map
