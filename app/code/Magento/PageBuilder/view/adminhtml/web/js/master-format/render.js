/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

define(["jquery", "knockout", "Magento_Ui/js/lib/knockout/template/engine", "Magento_PageBuilder/js/utils/directives", "Magento_PageBuilder/js/master-format/filter-html"], function (_jquery, _knockout, _engine, _directives, _filterHtml) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var MasterFormatRenderer =
  /*#__PURE__*/
  function () {
    function MasterFormatRenderer() {
      this.rootTemplate = "Magento_PageBuilder/content-type/master";
    }

    var _proto = MasterFormatRenderer.prototype;

    /**
     * Render a tree of content types instances stored in knockout
     *
     * @param {KnockoutObservableArray<ContentTypeInterface>} tree
     * @returns {Promise<string>}
     */
    _proto.applyBindings = function applyBindings(tree) {
      var _this = this;

      var element = (0, _jquery)("<div>");
      return new Promise(function (resolve, reject) {
        _engine.waitForFinishRender().then(function () {
          _knockout.cleanNode(element[0]);

          var filtered = (0, _filterHtml)(element);
          var output = (0, _directives)(filtered.html());
          element.remove();
          resolve(output);
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

    return MasterFormatRenderer;
  }();

  return _extends(MasterFormatRenderer, {
    __esModule: true
  });
});
//# sourceMappingURL=render.js.map
