/*eslint-disable */
define(["jquery", "knockout", "Magento_Ui/js/lib/knockout/template/engine", "Magento_PageBuilder/js/master-format/filter-html", "Magento_PageBuilder/js/utils/directives", "Magento_PageBuilder/js/render/content-type", "Magento_PageBuilder/js/render/view-model"], function (_jquery, _knockout, _engine, _filterHtml, _directives, _contentType, _viewModel) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var port = null;

  var portDeferred = _jquery.Deferred();

  var deferredTemplates = {};
  /**
   * Listen for requests from the parent window for a render
   */

  function listen() {
    window.addEventListener("message", function (event) {
      if (event.ports && event.ports.length) {
        port = event.ports[0];
        portDeferred.resolve(port);

        port.onmessage = function (messageEvent) {
          if (messageEvent.data.type === "render") {
            render(messageEvent.data.message).then(function (output) {
              port.postMessage({
                type: "render",
                message: output
              });
            });
          }

          if (messageEvent.data.type === "template") {
            var message = messageEvent.data.message;

            if (message.name in deferredTemplates) {
              deferredTemplates[message.name].resolve(message.template);
              delete deferredTemplates[message.name];
            }
          }
        };
      }
    }, false);
    window.parent.postMessage("PB_RENDER_READY", "*");
  }
  /**
   * Load a template from the parent window
   *
   * @param name
   */


  function loadTemplate(name) {
    return new Promise(function (resolve) {
      if (!(name in deferredTemplates)) {
        deferredTemplates[name] = _jquery.Deferred();
      }

      deferredTemplates[name].then(function (template) {
        resolve(template);
      });

      if (port) {
        port.postMessage({
          type: "template",
          message: name
        });
      } else {
        portDeferred.then(function (messagePort) {
          messagePort.postMessage({
            type: "template",
            message: name
          });
        });
      }
    });
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

  return Object.assign(listen, {
    loadTemplate: loadTemplate
  });
});
//# sourceMappingURL=frame.js.map