define(["./block", "knockout"], function (_block, _knockout) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var ColumnGroup =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(ColumnGroup, _Block);

    function ColumnGroup(parent, stage, config, formData, appearance) {
      var _this;

      _this = _Block.call(this, parent, stage, config, formData, appearance) || this; // Remove self if all columns are removed

      _this.resizing = _knockout.observable(false);

      _this.children.subscribe(function (children) {
        if (children.length === 0) {
          _this.parent.removeChild(_this);
        }
      });

      return _this;
    }

    return ColumnGroup;
  }(_block);

  return ColumnGroup;
});
//# sourceMappingURL=column-group.js.map
