/*eslint-disable */
/* jscs:disable */
define(["jquery", "knockout", "Magento_Ui/js/lib/knockout/template/engine", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/utils/directives", "Magento_PageBuilder/js/master-format/filter-html"], function (_jquery, _knockout, _engine, _config, _contentTypeFactory, _directives, _filterHtml) {
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

  function listen(config) {
    _config.setConfig(config);

    _config.setMode("Master");
    /**
     * Create a listener within our iframe so we can observe messages from the parent, once we receive a port on the
     * MessageChannel we utilise that for all communication.
     */


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
    }, false); // Inform the parent iframe that we're ready to receive the port

    window.parent.postMessage("PB_RENDER_READY", "*");
  }
  /**
   * Use our MessageChannel to load a template from the parent window, this is required as the iframe isn't allowed to
   * make same origin XHR requests.
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
   * @param message
   */


  function render(message) {
    return new Promise(function (resolve, reject) {
      createRenderTree(message.stageId, message.tree).then(function (rootContainer) {
        var element = document.createElement("div");

        _engine.waitForFinishRender().then(function () {
          _knockout.cleanNode(element);

          var filtered = (0, _filterHtml)((0, _jquery)(element));
          var output = (0, _directives)(filtered.html());
          resolve(output);
        });

        _knockout.applyBindingsToNode(element, {
          template: {
            data: rootContainer.content,
            name: rootContainer.content.template
          }
        });
      }).catch(function (error) {
        reject(error);
      });
    });
  }
  /**
   * Rebuild the content type tree using their original data and configuration
   *
   * @param stageId
   * @param tree
   * @param parent
   */


  function createRenderTree(stageId, tree, parent) {
    if (parent === void 0) {
      parent = null;
    }

    return new Promise(function (resolve, reject) {
      (0, _contentTypeFactory)(_config.getContentTypeConfig(tree.name), parent, stageId, tree.data, parent !== null ? tree.children.length : null).then(function (contentType) {
        // Ensure  we retain the original tree ID's
        contentType.id = tree.id;

        if (tree.children.length > 0) {
          var childPromises = [];
          tree.children.forEach(function (child) {
            childPromises.push(createRenderTree(stageId, child, contentType));
          });
          Promise.all(childPromises).then(function (children) {
            children.forEach(function (child) {
              contentType.addChild(child);
            });
            resolve(contentType);
          });
        } else {
          resolve(contentType);
        }
      }).catch(function (error) {
        reject(error);
      });
    });
  }

  return Object.assign(listen, {
    loadTemplate: loadTemplate
  });
});
//# sourceMappingURL=frame.js.map