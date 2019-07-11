/*eslint-disable */
define(["jquery", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/master-format/render/serialize"], function (_jquery, _config, _serialize) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var MasterFormatRenderer =
  /*#__PURE__*/
  function () {
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
     * Render the root container into a string
     *
     * @param {ContentTypeCollection} rootContainer
     * @returns {Promise<string>}
     */


    var _proto = MasterFormatRenderer.prototype;

    _proto.applyBindings = function applyBindings(rootContainer) {
      var _this = this;

      if (!this.getRenderFrame()) {
        console.error("No render frame present for Page Builder instance.");
        return;
      }

      return new Promise(function (resolve, reject) {
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
              reject();
            }
          };
        } else {
          _this.readyDeferred.then(function () {
            _this.applyBindings(rootContainer).then(function (rendered) {
              resolve(rendered);
            }).catch(function () {
              reject();
            });
          });
        }
      });
    }
    /**
     * Create a channel to communicate with our sandboxed iframe
     */
    ;

    _proto.setupChannel = function setupChannel() {
      var _this2 = this;

      this.channel = new MessageChannel();
      var frame = this.getRenderFrame();
      window.addEventListener("message", function (event) {
        if (event.data === "PB_RENDER_READY") {
          frame.contentWindow.postMessage("PB_RENDER_PORT", "*", [_this2.channel.port2]);
          _this2.ready = true;

          _this2.readyDeferred.resolve();
        }
      });
      frame.src = _config.getConfig("render_url");
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