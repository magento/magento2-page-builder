/*eslint-disable */
define(["jquery", "knockout", "Magento_Ui/js/lib/knockout/template/engine", "Magento_PageBuilder/js/utils/directives", "Magento_PageBuilder/js/master-format/filter-html"], function (_jquery, _knockout, _engine, _directives, _filterHtml) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var MasterFormatRenderer =
  /*#__PURE__*/
  function () {
    "use strict";

    function MasterFormatRenderer() {}

    var _proto = MasterFormatRenderer.prototype;

    /**
     * Render the root container into a string
     *
     * @param {ContentTypeCollection} rootContainer
     * @returns {Promise<string>}
     */
    _proto.applyBindings = function applyBindings(rootContainer) {
      var element = (0, _jquery)("<div>");
      return new Promise(function (resolve) {
        _engine.waitForFinishRender().then(function () {
          _knockout.cleanNode(element[0]);

          var filtered = (0, _filterHtml)(element);
          var output = (0, _directives)(filtered.html());
          element.remove();
          resolve(output);
        });

        _knockout.applyBindingsToNode(element[0], {
          template: {
            data: rootContainer.content,
            name: rootContainer.content.template
          }
        });
      }).catch(function (error) {
        console.error(error);
        return null;
      });
    };

    return MasterFormatRenderer;
  }();

  return MasterFormatRenderer;
});
//# sourceMappingURL=render.js.map