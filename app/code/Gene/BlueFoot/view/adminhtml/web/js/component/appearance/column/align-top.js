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

  var AlignTop = function () {
    function AlignTop() {
      _classCallCheck(this, AlignTop);
    }

    AlignTop.prototype.getData = function getData() {
      return { flex_grow: 1, align_self: 'flex-start' };
    };

    return AlignTop;
  }();

  exports.default = AlignTop;
});