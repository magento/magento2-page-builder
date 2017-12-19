define(["knockout", "./block"], function (_knockout, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Row =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Row, _PreviewBlock);

    /**
     * @param {Block} parent
     * @param {Object} config
     */
    function Row(parent, config) {
      var _this;

      _this = _PreviewBlock.call(this, parent, config) || this;
      _this.rowStyle = void 0;
      _this.rowStyle = _knockout.computed(function () {
        var style = {};

        if (_this.data.background) {}

        return style;
      });
      return _this;
    }

    return Row;
  }(_block);

  return Row;
});
//# sourceMappingURL=row.js.map
