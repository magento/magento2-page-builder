/*eslint-disable */
/* jscs:disable */
define(["jquery", "knockout", "Magento_PageBuilder/js/events", "Magento_Ui/js/lib/knockout/template/loader", "mageUtils", "underscore", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/panel", "Magento_PageBuilder/js/stage"], function (_jquery, _knockout, _events, _loader, _mageUtils, _underscore, _config, _contentTypeFactory, _panel, _stage) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var PageBuilder =
  /*#__PURE__*/
  function () {
    "use strict";

    function PageBuilder(config, initialValue) {
      var _this = this;

      this.template = "Magento_PageBuilder/page-builder";
      this.isStageReady = _knockout.observable(false);
      this.id = _mageUtils.uniqueid();
      this.originalScrollTop = 0;
      this.isFullScreen = _knockout.observable(false);
      this.loading = _knockout.observable(true);
      this.wrapperStyles = _knockout.observable({});
      this.previousWrapperStyles = {};

      _config.setConfig(config);

      _config.setMode("Preview");

      this.preloadTemplates(config);
      this.initialValue = initialValue;
      this.isFullScreen(config.isFullScreen);
      this.config = config; // Create the required root container for the stage

      (0, _contentTypeFactory)(_config.getContentTypeConfig(_stage.rootContainerName), null, this.id).then(function (rootContainer) {
        _this.stage = new _stage(_this, rootContainer);

        _this.isStageReady(true);
      });
      this.panel = new _panel(this);
      this.initListeners();
    }
    /**
     * Init listeners.
     */


    var _proto = PageBuilder.prototype;

    _proto.initListeners = function initListeners() {
      var _this2 = this;

      _events.on("stage:" + this.id + ":toggleFullscreen", this.toggleFullScreen.bind(this));

      this.isFullScreen.subscribe(function () {
        return _this2.onFullScreenChange();
      });
    }
    /**
     * Tells the stage wrapper to expand to fullScreen
     *
     * @param {StageToggleFullScreenParamsInterface} args
     */
    ;

    _proto.toggleFullScreen = function toggleFullScreen(args) {
      var _this3 = this;

      if (args.animate === false) {
        this.isFullScreen(!this.isFullScreen());
        return;
      }

      var stageWrapper = (0, _jquery)("#" + this.stage.id).parent();
      var pageBuilderWrapper = stageWrapper.parents(".pagebuilder-wysiwyg-wrapper");
      var panel = stageWrapper.find(".pagebuilder-panel");

      if (!this.isFullScreen()) {
        pageBuilderWrapper.css("height", pageBuilderWrapper.outerHeight());
        this.previousPanelHeight = panel.outerHeight();
        panel.css("height", this.previousPanelHeight + "px");
        /**
         * Fix the stage in the exact place it is when it's part of the content and allow it to transition to full
         * screen.
         */

        var xPosition = parseInt(stageWrapper.offset().top.toString(), 10) - parseInt((0, _jquery)(window).scrollTop().toString(), 10);
        var yPosition = stageWrapper.offset().left;
        this.previousWrapperStyles = {
          position: "fixed",
          top: xPosition + "px",
          left: yPosition + "px",
          zIndex: "800",
          width: stageWrapper.outerWidth().toString() + "px"
        };
        this.wrapperStyles(this.previousWrapperStyles);
        this.isFullScreen(true);

        _underscore.defer(function () {
          // Remove all styles we applied to fix the position once we're transitioning
          panel.css("height", "");

          _this3.wrapperStyles(Object.keys(_this3.previousWrapperStyles).reduce(function (object, styleName) {
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
          pageBuilderWrapper.css("height", "");

          _this3.wrapperStyles(Object.keys(_this3.previousWrapperStyles).reduce(function (object, styleName) {
            var _Object$assign2;

            return Object.assign(object, (_Object$assign2 = {}, _Object$assign2[styleName] = "", _Object$assign2));
          }, {}));

          _this3.previousWrapperStyles = {};
          _this3.previousPanelHeight = null;
        }, 350);
      }
    }
    /**
     * Change window scroll base on full screen mode.
     */
    ;

    _proto.onFullScreenChange = function onFullScreenChange() {
      if (this.isFullScreen()) {
        (0, _jquery)("body").css("overflow", "hidden");
      } else {
        (0, _jquery)("body").css("overflow", "");
      }

      _events.trigger("stage:" + this.id + ":fullScreenModeChangeAfter", {
        fullScreen: this.isFullScreen()
      });
    }
    /**
     * Get template.
     *
     * @returns {string}
     */
    ;

    _proto.getTemplate = function getTemplate() {
      return this.template;
    }
    /**
     * Preload all templates into the window to reduce calls later in the app
     *
     * @param config
     */
    ;

    _proto.preloadTemplates = function preloadTemplates(config) {
      var previewTemplates = _underscore.values(config.content_types).map(function (contentType) {
        return _underscore.values(contentType.appearances).map(function (appearance) {
          return appearance.preview_template;
        });
      }).reduce(function (array, value) {
        return array.concat(value);
      }, []).map(function (value) {
        return (0, _loader.formatPath)(value);
      });

      _underscore.defer(function () {
        require(previewTemplates);
      });
    };

    return PageBuilder;
  }();

  return PageBuilder;
});
//# sourceMappingURL=page-builder.js.map