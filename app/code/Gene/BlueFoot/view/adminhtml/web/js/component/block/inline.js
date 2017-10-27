define(["./block"], function (_block) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  /**
   * InlineBlock class
   *
   * @author Dave Macaulay <dmacaulay@magento.com>
   */
  var InlineBlock =
  /*#__PURE__*/
  function (_Block) {
    _inherits(InlineBlock, _Block);

    function InlineBlock() {
      var _ref;

      var _temp, _this;

      _classCallCheck(this, InlineBlock);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _possibleConstructorReturn(_this, (_temp = _this = _possibleConstructorReturn(this, (_ref = InlineBlock.__proto__ || Object.getPrototypeOf(InlineBlock)).call.apply(_ref, [this].concat(args))), _this.editOnInsert = false, _temp));
    }

    _createClass(InlineBlock, [{
      key: "getPreviewTemplate",

      /**
       * Get template master format template
       *
       * @returns {string}
       */
      value: function getPreviewTemplate() {
        return 'Gene_BlueFoot/component/stage/structural/render/heading.html';
      }
    }]);

    return InlineBlock;
  }(_block);

  return InlineBlock;
});
//# sourceMappingURL=inline.js.map
