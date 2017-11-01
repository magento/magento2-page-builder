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

  var AlignBottom = function () {
    function AlignBottom() {
      _classCallCheck(this, AlignBottom);
    }

    AlignBottom.prototype.apply = function apply(data) {
      data['align_self'] = 'flex-end';
      return data;
    };

    return AlignBottom;
  }();

  exports.default = AlignBottom;
});