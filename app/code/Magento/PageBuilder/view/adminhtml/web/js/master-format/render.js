/*eslint-disable */
/* jscs:disable */
define(["jquery", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/master-format/render/serialize"], function (_jquery, _config, _serialize) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var MasterFormatRenderer = /*#__PURE__*/function () {
    "use strict";

    /**
     * @param stageId
     */
    function MasterFormatRenderer(stageId) {
      this.ready = false;
      this.readyDeferred = _jquery.Deferred();
      this.stageId = stageId;
    }
    /**
     * Render the root container into a string utilising our sandboxed iframe
     *
     * @param {ContentTypeCollection} rootContainer
     * @returns {Promise<string>}
     */


    var _proto = MasterFormatRenderer.prototype;

    _proto.applyBindings = function applyBindings(rootContainer) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        if (!_this.getRenderFrame()) {
          // If the stage exists we should also have a frame
          if (document.getElementById(_this.stageId)) {
            return reject("No render frame present for Page Builder instance.");
          } // Otherwise the instance of Page Builder has been removed from the DOM and this is an old instance.


          return reject();
        }

        if (_this.ready) {
          _this.channel.port1.postMessage({
            type: "render",
            message: {
              stageId: _this.stageId,
              tree: (0, _serialize.getSerializedTree)(rootContainer)
            }
          });

          _this.channel.port1.onmessage = function (event) {
            if (event.isTrusted) {
              if (event.data.type === "render") {
                resolve(event.data.message);
              }

              if (event.data.type === "template") {
                _this.loadTemplate(event.data.message);
              }
            } else {
              reject("Render event was not trusted.");
            }
          };
        } else {
          _this.readyDeferred.then(function () {
            _this.applyBindings(rootContainer).then(function (rendered) {
              resolve(rendered);
            }).catch(function (error) {
              reject(error);
            });
          });
        }
      });
    }
    /**
     * Create a channel to communicate with our sandboxed iframe. Firstly add a listener to the current window and then
     * set the src of the iframe. Listening for a specific message event with a predefined term and then hand over the
     * MessageChannel port to allow communication between the main window and iframe.
     */
    ;

    _proto.setupChannel = function setupChannel() {
      var _this2 = this;

      this.channel = new MessageChannel();
      var frame = this.getRenderFrame();
      window.addEventListener("message", function (event) {
        if (!_this2.ready && event.data.name === "PB_RENDER_READY" && _this2.stageId === event.data.stageId) {
          frame.contentWindow.postMessage("PB_RENDER_PORT", "*", [_this2.channel.port2]);
          _this2.ready = true;

          _this2.readyDeferred.resolve();
        }
      });
      frame.src = _config.getConfig("render_url") + "?stageId=" + this.stageId;
    }
    /**
     * Use the text! RequireJS plugin to load a template and send it back to the child render iframe
     *
     * @param name
     */
    ;

    _proto.loadTemplate = function loadTemplate(name) {
      var _this3 = this;

      require(["text!" + name], function (template) {
        _this3.channel.port1.postMessage({
          type: "template",
          message: {
            name: name,
            template: template
          }
        });
      });
    }
    /**
     * Retrieve the render frame
     *
     * @returns {HTMLIFrameElement}
     */
    ;

    _proto.getRenderFrame = function getRenderFrame() {
      return document.getElementById("render_frame_" + this.stageId);
    };

    return MasterFormatRenderer;
  }();

  return MasterFormatRenderer;
});
//# sourceMappingURL=render.js.map