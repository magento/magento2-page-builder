/*eslint-disable */
define(["./block"], function (_block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Heading =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Heading, _PreviewBlock);

    function Heading() {
      return _PreviewBlock.apply(this, arguments) || this;
    }

    var _proto = Heading.prototype;

    /**
     * Get the banner wrapper attributes for the preview
     *
     * @returns {any}
     */
    _proto.getHeadingStyles = function getHeadingStyles() {
      var data = this.data;
      var styles = "pagebuilder-heading-" + data.heading_type();

      if (data.heading_text() === "") {
        styles += " placeholder-text";
      }

      return styles;
    };

    return Heading;
  }(_block);

  return Heading;
});
//# sourceMappingURL=heading.js.map
