/*eslint-disable */
/* jscs:disable */
define(["knockout", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/content-type/style-registry"], function (_knockout, _events, _styleRegistry) {
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
      this.template = "Magento_PageBuilder/content-type/preview-styles";
      this.stageId = stageId;

      _events.on("styles:update", function (args) {
        if (args.stageId === _this.stageId) {
          var css = (0, _styleRegistry.generateCssBlock)(args.className, args.styles); // Remove any existing style blocks for the current class name

          var existingBlock = _this.styleBlocks().find(function (block) {
            return block.className === args.className;
          });

          if (existingBlock) {
            // Don't do an update if the CSS matches
            if (existingBlock.css === css) {
              return;
            }

            _this.styleBlocks.splice(_this.styleBlocks().indexOf(existingBlock), 1);
          }

          _this.styleBlocks.push({
            className: args.className,
            css: css
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
      return this.template;
    };

    return PreviewStyles;
  }();

  return PreviewStyles;
});
//# sourceMappingURL=preview-styles.js.map