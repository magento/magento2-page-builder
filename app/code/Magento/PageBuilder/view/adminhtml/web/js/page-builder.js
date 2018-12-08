/*eslint-disable */
define(["underscore", "jquery", "knockout", "Magento_PageBuilder/js/events", "mageUtils", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/panel", "Magento_PageBuilder/js/stage"], function (_underscore, _jquery, _knockout, _events, _mageUtils, _config, _panel, _stage) {
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
      this.wrapperStyles = _knockout.observable({});
      this.previousWrapperStyles = {};

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
      var _this2 = this;

      var stageWrapper = (0, _jquery)("#" + this.stage.id).parent();
      var pageBuilderWrapper = stageWrapper.parents(".pagebuilder-wysiwyg-wrapper");
      var panel = stageWrapper.find(".pagebuilder-panel");

      if (!this.isFullScreen()) {
        pageBuilderWrapper.height(pageBuilderWrapper.outerHeight());
        this.previousPanelHeight = panel.outerHeight();
        panel.css("height", this.previousPanelHeight + "px");
        /**
         * Fix the stage in the exact place it is when it's part of the content and allow it to transition to full
         * screen.
         */

        this.previousWrapperStyles = {
          'position': 'fixed',
          'top': parseInt(stageWrapper.offset().top.toString(), 10) - parseInt((0, _jquery)(window).scrollTop().toString(), 10) + 'px',
          'left': stageWrapper.offset().left + 'px',
          'zIndex': '800',
          'width': stageWrapper.outerWidth().toString() + 'px'
        };
        this.wrapperStyles(this.previousWrapperStyles);
        this.isFullScreen(true);

        _underscore.defer(function () {
          // Remove all styles we applied to fix the position once we're transitioning
          panel.css("height", "");

          _this2.wrapperStyles(Object.keys(_this2.previousWrapperStyles).reduce(function (object, styleName) {
            var _Object$assign;

            return Object.assign(object, (_Object$assign = {}, _Object$assign[styleName] = "", _Object$assign));
          }, {}));
        });
      } else {
        // When leaving full screen mode just transition back to the original state
        this.wrapperStyles(this.previousWrapperStyles);
        this.isFullScreen(false);
        panel.css("height", this.previousPanelHeight + "px"); // Wait for the 350ms animation to complete before changing these properties back

        _underscore.delay(function () {
          panel.css("height", "");

          _this2.wrapperStyles(Object.keys(_this2.previousWrapperStyles).reduce(function (object, styleName) {
            var _Object$assign2;

            return Object.assign(object, (_Object$assign2 = {}, _Object$assign2[styleName] = "", _Object$assign2));
          }, {}));

          _this2.previousWrapperStyles = {};
          _this2.previousPanelHeight = null;
        }, 350);
      }
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
