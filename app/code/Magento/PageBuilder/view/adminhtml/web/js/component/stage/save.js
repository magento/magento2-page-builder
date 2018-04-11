/*eslint-disable */
define(["jquery", "knockout", "Magento_Ui/js/lib/knockout/template/engine", "Magento_PageBuilder/js/component/format/filter-html", "Magento_PageBuilder/js/utils/directives"], function (_jquery, _knockout, _engine, _filterHtml, _directives) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Render the tree into a string
   *
   * @param {KnockoutObservableArray<Structural>} tree
   */
  var Save =
  /*#__PURE__*/
  function () {
    function Save() {
      this.rootTemplate = "Magento_PageBuilder/component/block/render/root.html";
    }

    var _proto = Save.prototype;

    /**
     * Render a tree of content types instances stored in knockout
     *
     * @param {KnockoutObservableArray<Structural>} tree
     * @returns {Promise<string>}
     */
    _proto.renderTree = function renderTree(tree) {
      var _this = this;

      var element = (0, _jquery)("<div>");
      return new Promise(function (resolve, reject) {
        _engine.waitForFinishRender().then(function () {
          var filtered = (0, _filterHtml)(element);
          var output = (0, _directives)(filtered.html());
          console.log(output);
          resolve(output);
          element.remove();
        });

        _knockout.applyBindingsToNode(element[0], {
          template: {
            data: {
              getChildren: function getChildren() {
                return tree;
              }
            },
            name: _this.rootTemplate
          }
        });
      });
    };

    return Save;
  }();

  return Save;
});
//# sourceMappingURL=save.js.map
