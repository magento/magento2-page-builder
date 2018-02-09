/*eslint-disable */
define(["./block"], function (_block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Buttons =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Buttons, _PreviewBlock);

    function Buttons() {
      return _PreviewBlock.apply(this, arguments) || this;
    }

    var _proto = Buttons.prototype;

    /**
     * Setup fields observables within the data class property
     */
    _proto.setupDataFields = function setupDataFields() {
      _PreviewBlock.prototype.setupDataFields.call(this); // Declare our buttons, they'll get populated later


      this.updateDataValue("buttons", []);
    };

    return Buttons;
  }(_block);

  return Buttons;
});
//# sourceMappingURL=buttons.js.map
