define(["./block"], function (_block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var InlineBlock =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(InlineBlock, _Block);

    function InlineBlock() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _Block.call.apply(_Block, [this].concat(args)) || this, _this.editOnInsert = false, _temp) || _this;
    }

    return InlineBlock;
  }(_block);

  return InlineBlock;
});
//# sourceMappingURL=inline.js.map
