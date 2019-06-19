/*eslint-disable */
define(["Magento_PageBuilder/js/config", "Magento_PageBuilder/js/master-format/render/serialize"], function (_config, _serialize) {
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
            message: (0, _serialize.getSerializedTree)(rootContainer)
          });

          _this.channel.port1.onmessage = function (event) {
            console.log(event);

            if (event.isTrusted) {
              if (event.data.type === "render") {
                console.log(event.data);
                resolve(event.data);
              }

              if (event.data.type === "template") {
                _this.loadTemplate(event.data.message);
              }
            } else {
              reject();
            }
          };
        }
      });
    }
    /**
     * Setup the channel, wait for the frame to load and be ready for the port
     */
    ;

    _proto.setupChannel = function setupChannel() {
      var _this2 = this;

      this.channel = new MessageChannel();
      var frame = this.getRenderFrame();

      frame.onload = function () {
        window.addEventListener("message", function (event) {
          if (event.data === "PB_RENDER_READY") {
            frame.contentWindow.postMessage("PB_RENDER_PORT", "*", [_this2.channel.port2]);
            _this2.ready = true;
          }
        });
      };
    }
    /**
     * Load a template for the child render frame
     *
     * @param name
     */
    ;

    _proto.loadTemplate = function loadTemplate(name) {
      var _this3 = this;

      console.log("request template", name);

      require(["text!" + name], function (template) {
        console.log("load template", name, template);

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
     * Retrieve the target origin
     */
    ;

    _proto.getTargetOrigin = function getTargetOrigin() {
      return new URL(_config.getConfig("render_url")).origin;
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