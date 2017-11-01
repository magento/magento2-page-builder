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

  var AlignCenter = function () {
    function AlignCenter() {
      _classCallCheck(this, AlignCenter);
    }

    AlignCenter.prototype.apply = function apply(data) {
      data['align_self'] = 'center';
      return data;
    };

    return AlignCenter;
  }();

  exports.default = AlignCenter;
});