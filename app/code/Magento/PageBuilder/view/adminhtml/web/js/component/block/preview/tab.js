/*eslint-disable */
define(["tabs", "Magento_PageBuilder/js/utils/color-converter", "Magento_PageBuilder/js/component/block/preview/block"], function (_tabs, _colorConverter, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Tab =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Tab, _PreviewBlock);

    function Tab() {
      return _PreviewBlock.apply(this, arguments) || this;
    }

    var _proto = Tab.prototype;

    /**
     * Get the Tab style attributes for the preview
     *
     * @returns {any}
     */
    _proto.getTabStyles = function getTabStyles() {
      var backgroundImage = "none";

      if (this.data.background_image && this.data.background_image() !== "" && this.data.background_image() !== undefined && this.data.background_image()[0] !== undefined) {
        backgroundImage = "url(" + this.data.background_image()[0].url + ")";
      }

      var backgroundColor = "transparent";

      if (this.data.background_color() !== "") {
        backgroundColor = (0, _colorConverter.fromHex)(this.data.background_color(), "1");
      }

      var marginsPadding = typeof this.data.margins_and_padding() === "string" ? JSON.parse(this.data.margins_and_padding()) : this.data.margins_and_padding();
      var paddingTop = marginsPadding.padding.top || "0";
      var paddingRight = marginsPadding.padding.right || "0";
      var paddingBottom = marginsPadding.padding.bottom || "0";
      var paddingLeft = marginsPadding.padding.left || "0";
      return {
        paddingBottom: paddingBottom + "px",
        paddingLeft: paddingLeft + "px",
        paddingRight: paddingRight + "px",
        paddingTop: paddingTop + "px",
        backgroundImage: backgroundImage,
        backgroundColor: backgroundColor,
        backgroundSize: this.data.background_size(),
        overflow: "hidden",
        border: this.data.border()
      };
    };
    /**
     * Get the Tab header style attributes for the preview
     *
     * @returns {any}
     */


    _proto.getTabHeaderStyles = function getTabHeaderStyles() {
      var tabStyles = this.getTabStyles();
      return {
        backgroundColor: tabStyles.backgroundColor,
        borderTop: tabStyles.border,
        borderRight: tabStyles.border,
        borderLeft: tabStyles.border
      };
    };

    return Tab;
  }(_block);

  return Tab;
});
//# sourceMappingURL=tab.js.map
