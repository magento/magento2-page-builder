/*eslint-disable */
define(["./block"], function (_block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Divider =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Divider, _Block);

    function Divider() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = Divider.prototype;

    /**
     * Get divider styles
     *
     * @returns {any}
     */
    _proto.getLineStyle = function getLineStyle() {
      var data = this.getData();
      return {
        width: data.line_width,
        borderWidth: data.line_thickness + "px",
        borderColor: data.line_color
      };
    };

    return Divider;
  }(_block);

  return Divider;
});
//# sourceMappingURL=divider.js.map
