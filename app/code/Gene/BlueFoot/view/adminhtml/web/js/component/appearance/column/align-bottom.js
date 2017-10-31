define(['exports', 'underscore'], function (exports, _underscore) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _underscore2 = _interopRequireDefault(_underscore);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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
      _underscore2.default.extend(data, { flex_grow: 1, align_self: 'flex-end' });
      return data;
    };

    return AlignBottom;
  }();

  exports.default = AlignBottom;
});