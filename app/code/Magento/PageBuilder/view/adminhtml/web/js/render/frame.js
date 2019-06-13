/*eslint-disable */
define(["jquery", "knockout", "Magento_Ui/js/lib/knockout/template/engine", "Magento_PageBuilder/js/render/view-model", "Magento_PageBuilder/js/render/content-type", "Magento_PageBuilder/js/master-format/filter-html", "Magento_PageBuilder/js/utils/directives"], function (_jquery, _knockout, _engine, _viewModel, _contentType, _filterHtml, _directives) {
  /**
   * Listen for requests from the parent window for a render
   */
  function listen(baseUrl) {
    window.addEventListener("message", function (event) {
      if (event.ports && event.ports.length) {
        var port = event.ports[0];

        port.onmessage = function (event) {
          render(event.data).then(function (output) {
            port.postMessage(output);
          });
        };
      }
    }, false);
    window.parent.postMessage("PB_RENDER_READY", new URL(baseUrl).origin);
  }
  /**
   * Perform a render of the provided data
   * 
   * @param tree 
   */


  function render(tree) {
    return new Promise(function (resolve, reject) {
      var renderTree = createRenderTree(tree);
      var element = document.createElement("div");

      _engine.waitForFinishRender().then(function () {
        _knockout.cleanNode(element);

        var filtered = (0, _filterHtml)((0, _jquery)(element));
        var output = (0, _directives)(filtered.html());
        element.remove();
        resolve(output);
      });

      _knockout.applyBindingsToNode(element, {
        template: {
          data: renderTree.content,
          name: renderTree.content.template
        }
      });
    });
  }
  /**
   * Convert the serialised data back into a renderable tree conforming to the same interface as the previous renderer
   * 
   * @param tree 
   */


  function createRenderTree(tree) {
    var contentType = new _contentType(new _viewModel(tree.template, tree.data));

    if (tree.children.length > 0) {
      tree.children.forEach(function (child) {
        contentType.children.push(createRenderTree(child));
      });
    }

    return contentType;
  }

  return listen;
});
//# sourceMappingURL=frame.js.map