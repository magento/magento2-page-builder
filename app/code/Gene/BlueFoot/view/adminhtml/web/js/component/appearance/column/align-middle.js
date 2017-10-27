define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var AlignMiddle = function () {
    function AlignMiddle() {
      _classCallCheck(this, AlignMiddle);
    }

    AlignMiddle.prototype.getData = function getData() {
      return { flex_grow: 1, align_self: 'center' };
    };

    return AlignMiddle;
  }();

  exports.default = AlignMiddle;
});