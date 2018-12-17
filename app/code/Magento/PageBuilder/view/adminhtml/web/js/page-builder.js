/*eslint-disable */
define(["jquery", "knockout", "Magento_PageBuilder/js/events", "mageUtils", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/panel", "Magento_PageBuilder/js/stage"], function (_jquery, _knockout, _events, _mageUtils, _config, _panel, _stage) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var PageBuilder =
  /*#__PURE__*/
  function () {
    "use strict";

    function PageBuilder(config, initialValue) {
      this.template = "Magento_PageBuilder/page-builder";
      this.id = _mageUtils.uniqueid();
      this.originalScrollTop = 0;
      this.isFullScreen = _knockout.observable(false);
      this.loading = _knockout.observable(true);

      _config.setConfig(config);

      this.initialValue = initialValue;
      this.isFullScreen(config.isFullScreen);
      this.config = config;
      this.stage = new _stage(this);
      this.panel = new _panel(this);
      this.initListeners();
    }
    /**
     * Init listeners.
     */


    var _proto = PageBuilder.prototype;

    _proto.initListeners = function initListeners() {
      var _this = this;

      _events.on("stage:" + this.id + ":toggleFullscreen", function () {
        return _this.toggleFullScreen();
      });

      this.isFullScreen.subscribe(function () {
        return _this.onFullScreenChange();
      });
    };
    /**
     * Tells the stage wrapper to expand to fullScreen
     */


    _proto.toggleFullScreen = function toggleFullScreen() {
      this.isFullScreen(!this.isFullScreen());
    };
    /**
     * Change window scroll base on full screen mode.
     */


    _proto.onFullScreenChange = function onFullScreenChange() {
      if (this.isFullScreen()) {
        (0, _jquery)("body").css("overflow", "hidden");
      } else {
        (0, _jquery)("body").css("overflow", "");
      }

      _events.trigger("stage:" + this.id + ":fullScreenModeChangeAfter", {
        fullScreen: this.isFullScreen()
      });
    };
    /**
     * Get template.
     *
     * @returns {string}
     */


    _proto.getTemplate = function getTemplate() {
      return this.template;
    };

    return PageBuilder;
  }();

  return PageBuilder;
});
//# sourceMappingURL=page-builder.js.map
