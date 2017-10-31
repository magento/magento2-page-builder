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

  var AlignTop = function () {
    function AlignTop() {
      _classCallCheck(this, AlignTop);
    }

    AlignTop.prototype.apply = function apply(data) {
      _underscore2.default.extend(data, { flex_grow: 1, align_self: 'flex-start' });
      return data;
    };

    return AlignTop;
  }();

  exports.default = AlignTop;
});