/*eslint-disable */
define(["Magento_PageBuilder/js/component/block/preview/block", "Magento_PageBuilder/js/component/block/preview/column-group/resizing"], function (_block, _resizing) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Column =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Column, _PreviewBlock);

    /**
     * @param {Block} parent
     * @param {ConfigContentBlock} config
     */
    function Column(parent, config) {
      var _this;

      _this = _PreviewBlock.call(this, parent, config) || this;

      _this.data.width.subscribe(function (newWidth) {
        var maxColumns = (0, _resizing.getMaxColumns)();
        newWidth = parseFloat(newWidth);
        newWidth = Math.round(newWidth / (100 / maxColumns));
        var newLabel = newWidth + "/" + maxColumns;

        _this.displayLabel("Column " + newLabel);
      });

      return _this;
    }
    /**
     * Update the style attribute mapper converts images to directives, override it to include the correct URL
     *
     * @returns styles
     */


    var _proto = Column.prototype;

    _proto.afterStyleMapped = function afterStyleMapped(styles) {
      // Extract data values our of observable functions
      // The style attribute mapper converts images to directives, override it to include the correct URL
      if (this.data.background_image && _typeof(this.data.background_image()[0]) === "object") {
        styles.backgroundImage = "url(" + this.data.background_image()[0].url + ")";
      } // If we have left and right margins we need to minus this from the total width


      if (this.data.margins_and_padding && this.data.margins_and_padding().margin) {
        var margins = this.data.margins_and_padding().margin;
        var horizontalMargin = parseInt(margins.left || 0, 10) + parseInt(margins.right || 0, 10);
        styles.width = "calc(" + styles.width + " - " + horizontalMargin + "px)";
      } // If the right margin is 0, we set it to 1px to overlap the columns to create a single border


      if (styles.marginRight === "0px") {
        styles.marginRight = "1px";
      } // If the border is set to default we show no border in the admin preview, as we're unaware of the themes styles


      if (this.data.border && this.data.border() === "_default") {
        styles.border = "none";
      }

      return styles;
    };

    return Column;
  }(_block);

  return Column;
});
//# sourceMappingURL=column.js.map
