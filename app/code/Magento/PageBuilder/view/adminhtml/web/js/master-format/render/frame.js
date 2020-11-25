/*eslint-disable */
/* jscs:disable */
define(["csso", "jquery", "knockout", "Magento_Ui/js/lib/knockout/template/engine", "mageUtils", "underscore", "Magento_PageBuilder/js/binding/master-style", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/content-type/style-registry", "Magento_PageBuilder/js/utils/directives", "Magento_PageBuilder/js/master-format/filter-html"], function (_csso, _jquery, _knockout, _engine, _mageUtils, _underscore, _masterStyle, _config, _contentTypeFactory, _styleRegistry, _directives, _filterHtml) {
  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var port = null;

  var portDeferred = _jquery.Deferred();

  var deferredTemplates = {};
  var lastRenderId;
  /**
   * Debounce the render call, so we don't render until the final request
   */

  var debounceRender = _underscore.debounce(function (message, renderId) {
    render(message, renderId).then(function (output) {
      // Only post the most recent render back to the parent
      if (lastRenderId === renderId) {
        port.postMessage({
          type: "render",
          message: output
        });
      }
    });
  }, 50);
  /**
   * Listen for requests from the parent window for a render
   */


  function listen(config) {
    var stageId = window.location.href.split("?")[1].split("=")[1];

    _config.setConfig(config);

    _config.setMode("Master"); // Override assign with extend to prevent deep object overriding.


    Object.assign = _mageUtils.extend;
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
            var renderId = _mageUtils.uniqueid();

            lastRenderId = renderId;
            debounceRender(messageEvent.data.message, renderId);
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

    window.parent.postMessage({
      name: "PB_RENDER_READY",
      stageId: stageId
    }, "*");
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
   * Assert if the render has finished
   */


  var assertRenderFinished = _underscore.debounce(function (element, expectedCount, callback) {
    if (element.querySelectorAll("[data-content-type]").length === expectedCount) {
      callback();
    }
  }, 50);
  /**
   * Iterate over the root container and count all content types
   *
   * @param rootContainer
   * @param count
   */


  function countContentTypes(rootContainer, count) {
    count = count || 0;
    rootContainer.getChildren()().forEach(function (child) {
      ++count;

      if (typeof child.getChildren !== "undefined" && child.getChildren()().length > 0) {
        count = countContentTypes(child, count);
      }
    });
    return count;
  }
  /**
   * Perform a render of the provided data
   *
   * @param message
   * @param renderId
   */


  function render(message, renderId) {
    var styleRegistries = {};

    _underscore.each(_config.getConfig("viewports"), function (viewport, name) {
      styleRegistries[name] = new _styleRegistry(name + renderId);
    });

    return new Promise(function (resolve, reject) {
      createRenderTree(message.stageId, message.tree).then(function (rootContainer) {
        var element = document.createElement("div");
        /**
         * Setup an event on the element to observe changes and count the expected amount of content types are
         * present within the content.
         */

        var renderFinished = _jquery.Deferred();

        var observer = new MutationObserver(function () {
          assertRenderFinished(element, countContentTypes(rootContainer), renderFinished.resolve);
        });
        observer.observe(element, {
          attributes: true,
          childList: true,
          subtree: true
        }); // Combine this event with our engine waitForRenderFinish to ensure rendering is completed

        _jquery.when(_engine.waitForFinishRender(), renderFinished).then(function () {
          observer.disconnect();

          _knockout.cleanNode(element);

          var styles = generateMasterCssForViewports(styleRegistries);

          if (styles) {
            (0, _jquery)(element).append((0, _jquery)("<style/>").html(styles));
          }

          _underscore.each(styleRegistries, function (value, name) {
            return (0, _styleRegistry.deleteStyleRegistry)(name + renderId);
          });

          var filtered = (0, _filterHtml)((0, _jquery)(element));
          var output = (0, _directives.replaceWithSrc)((0, _directives)(filtered.html()));
          resolve(output);
        });

        _knockout.applyBindingsToNode(element, {
          template: {
            data: rootContainer.content,
            name: rootContainer.content.template
          }
        }, {
          id: renderId
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
      (0, _contentTypeFactory)(_config.getContentTypeConfig(tree.name), parent, stageId, tree.data, parent !== null ? tree.children.length : 0, tree.viewportsData).then(function (contentType) {
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
  /**
   * Generate the master format CSS
   *
   * @param registry
   */


  function generateMasterCss(registry) {
    var scopes = Object.keys(registry.getAllStyles()).map(function (selector) {
      return [selector];
    });
    return _csso.minify((0, _styleRegistry.generateCss)(registry.getAllStyles()), {
      usage: {
        scopes: scopes
      }
    }).css;
  }

  function generateMasterCssForViewports(registries) {
    var result = "";

    _underscore.each(registries, function (registry, name) {
      var css = generateMasterCss(registry);

      var media = _config.getConfig("viewports")[name].media;

      if (media && css) {
        result += "@media " + media + " { " + css + " }";
      } else {
        result += css;
      }
    });

    return result;
  }

  return Object.assign(listen, {
    loadTemplate: loadTemplate
  });
});
//# sourceMappingURL=frame.js.map