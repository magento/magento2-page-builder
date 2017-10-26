define(["./block"], function (_block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * InlineBlock class
   *
   * @author Dave Macaulay <dmacaulay@magento.com>
   */
  var InlineBlock =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(InlineBlock, _Block);

    function InlineBlock() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _Block.call.apply(_Block, [this].concat(args)) || this, Object.defineProperty(_this, "editOnInsert", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: false
      }), _temp) || _this;
    }

    var _proto = InlineBlock.prototype;

    /**
     * Get template master format template
     *
     * @returns {string}
     */
    _proto.getPreviewTemplate = function getPreviewTemplate() {
      return 'Gene_BlueFoot/component/stage/structural/render/heading.html';
    };

    return InlineBlock;
  }(_block);

  return InlineBlock;
});