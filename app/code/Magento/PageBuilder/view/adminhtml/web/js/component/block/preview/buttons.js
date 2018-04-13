/*eslint-disable */
define(["knockout", "Magento_PageBuilder/js/preview"], function (_knockout, _preview) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Buttons =
  /*#__PURE__*/
  function (_Preview) {
    _inheritsLoose(Buttons, _Preview);

    function Buttons() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _Preview.call.apply(_Preview, [this].concat(args)) || this, _this.isLiveEditing = _knockout.observable(false), _temp) || _this;
    }

    return Buttons;
  }(_preview);

  return Buttons;
});
//# sourceMappingURL=buttons.js.map
