define(["./block", "jquery"], function (_block, _jquery) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Column =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Column, _Block);

    function Column() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _Block.call.apply(_Block, [this].concat(args)) || this, _this.parent = void 0, _temp) || _this;
    }

    var _proto = Column.prototype;

    /**
     * Init the resize handle for the resizing functionality
     *
     * @param handle
     */
    _proto.initResizeHandle = function initResizeHandle(handle) {
      return this.parent.registerResizeHandle(this, (0, _jquery)(handle));
    };

    return Column;
  }(_block);

  return Column;
});
//# sourceMappingURL=column.js.map
