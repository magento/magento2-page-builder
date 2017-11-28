define(["./block", "knockout"], function (_block, _knockout) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Buttons =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Buttons, _Block);

    function Buttons(parent, config) {
      var _this;

      _this = _Block.call(this, parent, config) || this; // Declare our buttons, they'll get populated later

      _this.data.buttons = _knockout.observableArray([]);
      return _this;
    }

    return Buttons;
  }(_block);

  return Buttons;
});
//# sourceMappingURL=buttons.js.map
