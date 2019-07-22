/*eslint-disable */
define(["knockout", "Magento_PageBuilder/js/events", "underscore"], function (_knockout, _events, _underscore) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var PreviewStyles =
  /*#__PURE__*/
  function () {
    "use strict";

    function PreviewStyles(stageId) {
      var _this = this;

      this.styleBlocks = _knockout.observableArray([]);
      this.stageId = stageId;

      _events.on("styles:update", function (args) {
        if (args.stageId === _this.stageId) {
          var _css = _this.generateCss(args.className, args.styles); // Remove any existing style blocks for the current class name


          var existingBlock = _this.styleBlocks().find(function (block) {
            return block.className === args.className;
          });

          if (existingBlock) {
            // Don't do an update if the CSS matches
            if (existingBlock.css === _css) {
              return;
            }

            _this.styleBlocks.splice(_this.styleBlocks().indexOf(existingBlock), 1);
          }

          _this.styleBlocks.push({
            className: args.className,
            css: _css
          });
        }
      });
    }
    /**
     * Get template.
     *
     * @returns {string}
     */


    var _proto = PreviewStyles.prototype;

    _proto.getTemplate = function getTemplate() {
      return "Magento_PageBuilder/content-type/preview-styles";
    }
    /**
     * Generate CSS to push into the blocks
     *
     * @param className
     * @param styles
     */
    ;

    _proto.generateCss = function generateCss(className, styles) {
      var generatedStyles = "";
      Object.keys(styles).forEach(function (key) {
        if (!_underscore.isEmpty(styles[key])) {
          var formattedKey = key.replace(/[A-Z]/g, function (m) {
            return "-" + m.toLowerCase();
          });
          generatedStyles += formattedKey + ": " + styles[key] + "; ";
        }
      });
      return "." + className + " { " + generatedStyles + " }";
    };

    return PreviewStyles;
  }();

  return PreviewStyles;
});
//# sourceMappingURL=preview-styles.js.map