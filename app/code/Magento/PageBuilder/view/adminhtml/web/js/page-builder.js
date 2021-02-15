/*eslint-disable */
/* jscs:disable */

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

define(["jquery", "knockout", "mage/translate", "Magento_PageBuilder/js/events", "Magento_Ui/js/lib/knockout/template/loader", "Magento_Ui/js/modal/alert", "mageUtils", "underscore", "Magento_PageBuilder/js/acl", "Magento_PageBuilder/js/binding/style", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/panel", "Magento_PageBuilder/js/stage", "Magento_PageBuilder/js/template-manager"], function (_jquery, _knockout, _translate, _events, _loader, _alert, _mageUtils, _underscore, _acl, _style, _config, _contentTypeFactory, _panel, _stage, _templateManager) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var PageBuilder = /*#__PURE__*/function () {
    "use strict";

    function PageBuilder(config, initialValue) {
      var _this = this;

      this.template = "Magento_PageBuilder/page-builder";
      this.isStageReady = _knockout.observable(false);
      this.id = _mageUtils.uniqueid();
      this.originalScrollTop = 0;
      this.isFullScreen = _knockout.observable(false);
      this.isSnapshot = _knockout.observable(false);
      this.isSnapshotTransition = _knockout.observable(false);
      this.loading = _knockout.observable(true);
      this.wrapperStyles = _knockout.observable({});
      this.stageStyles = _knockout.observable({});
      this.viewport = _knockout.observable("");
      this.viewports = {};
      this.viewportClasses = {};
      this.previousStyles = {};

      _config.setConfig(config);

      _config.setMode("Preview");

      this.preloadTemplates(config);
      this.initialValue = initialValue;
      this.initViewports(config);
      this.isFullScreen(config.isFullScreen);
      this.isSnapshot(!!config.pagebuilder_content_snapshot);
      this.isSnapshotTransition(false);
      this.snapshot = !!config.pagebuilder_content_snapshot;
      this.config = config;
      this.isAllowedTemplateApply = (0, _acl.isAllowed)(_acl.resources.TEMPLATE_APPLY);
      this.isAllowedTemplateSave = (0, _acl.isAllowed)(_acl.resources.TEMPLATE_SAVE); // Create the required root container for the stage

      (0, _contentTypeFactory)(_config.getContentTypeConfig(_stage.rootContainerName), null, this.id).then(function (rootContainer) {
        _this.stage = new _stage(_this, rootContainer);

        _this.isStageReady(true);
      });
      this.panel = new _panel(this);
      this.initListeners();
    }
    /**
     * Destroy rootContainer instance.
     */


    var _proto = PageBuilder.prototype;

    _proto.destroy = function destroy() {
      this.stage.rootContainer.destroy();
    }
    /**
     * Init listeners.
     */
    ;

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

      if (this.snapshot) {
        stageWrapper.scrollTop(0);
      }

      if (!this.isFullScreen()) {
        pageBuilderWrapper.css("height", pageBuilderWrapper.outerHeight());
        /**
         * Fix the stage in the exact place it is when it's part of the content and allow it to transition to full
         * screen.
         */

        var xPosition = parseInt(stageWrapper.offset().top.toString(), 10) - parseInt((0, _jquery)(window).scrollTop().toString(), 10) - (this.snapshot ? 63 : 0);
        var yPosition = stageWrapper.offset().left - (this.snapshot ? 150 : 0);
        this.previousStyles = {
          position: this.snapshot ? "relative" : "fixed",
          top: xPosition + "px",
          left: yPosition + "px",
          zIndex: "800",
          width: stageWrapper.outerWidth().toString() + "px"
        };

        if (this.snapshot) {
          this.isSnapshot(false);
          this.stageStyles(this.previousStyles);
        } else {
          this.previousPanelHeight = panel.outerHeight();
          panel.css("height", this.previousPanelHeight + "px");
          this.wrapperStyles(this.previousStyles);
        }

        this.isFullScreen(true);

        _underscore.defer(function () {
          // Remove all styles we applied to fix the position once we're transitioning
          panel.css("height", "");

          if (_this3.snapshot) {
            _this3.stageStyles(Object.keys(_this3.previousStyles).reduce(function (object, styleName) {
              var _Object$assign;

              return Object.assign(object, (_Object$assign = {}, _Object$assign[styleName] = "", _Object$assign));
            }, {}));
          } else {
            _this3.wrapperStyles(Object.keys(_this3.previousStyles).reduce(function (object, styleName) {
              var _Object$assign2;

              return Object.assign(object, (_Object$assign2 = {}, _Object$assign2[styleName] = "", _Object$assign2));
            }, {}));
          }
        });
      } else {
        // When leaving full screen mode just transition back to the original state
        if (this.snapshot) {
          this.isSnapshotTransition(true);
          this.stageStyles(this.previousStyles);
        } else {
          this.wrapperStyles(this.previousStyles);
          this.isFullScreen(false);
        }

        panel.css("height", this.previousPanelHeight + "px"); // Wait for the 350ms animation to complete before changing these properties back

        _underscore.delay(function () {
          if (_this3.snapshot) {
            _this3.isSnapshot(true);

            _this3.isSnapshotTransition(false);

            _this3.stageStyles(Object.keys(_this3.previousStyles).reduce(function (object, styleName) {
              var _Object$assign3;

              return Object.assign(object, (_Object$assign3 = {}, _Object$assign3[styleName] = "", _Object$assign3));
            }, {}));

            _this3.isFullScreen(false);
          } else {
            _this3.wrapperStyles(Object.keys(_this3.previousStyles).reduce(function (object, styleName) {
              var _Object$assign4;

              return Object.assign(object, (_Object$assign4 = {}, _Object$assign4[styleName] = "", _Object$assign4));
            }, {}));
          }

          panel.css("height", "");
          pageBuilderWrapper.css("height", "");
          _this3.previousStyles = {};
          _this3.previousPanelHeight = null;
        }, 350);
      }

      return true;
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

      _events.trigger("stage:fullScreenModeChangeAfter", {
        pageBuilderId: this.id,
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
    };

    /**
     * Toggle template manager
     */
    _proto.toggleTemplateManger = function toggleTemplateManger() {
      if (!(0, _acl.isAllowed)(_acl.resources.TEMPLATE_APPLY)) {
        (0, _alert)({
          content: (0, _translate)("You do not have permission to apply templates."),
          title: (0, _translate)("Permission Error")
        });
        return false;
      }

      _events.trigger("stage:templateManager:open", {
        stage: this.stage
      });
    }
    /**
     * Enable saving the current stage as a template
     */
    ;

    _proto.saveAsTemplate = function saveAsTemplate() {
      return (0, _templateManager.saveAsTemplate)(this.stage);
    };

    _proto.toggleViewport = function toggleViewport(viewport) {
      var previousViewport = this.viewport();
      this.viewport(viewport);

      _underscore.each(this.viewportClasses, function (viewportClass) {
        viewportClass(false);
      });

      this.viewportClasses[viewport + "-viewport"](true);

      _config.setConfig({
        viewport: viewport
      });

      _events.trigger("stage:" + this.id + ":viewportChangeAfter", {
        viewport: viewport,
        previousViewport: previousViewport
      });

      _events.trigger("stage:viewportChangeAfter", {
        viewport: viewport,
        previousViewport: previousViewport
      });
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

    _proto.initViewports = function initViewports(config) {
      var _this4 = this;

      this.viewports = config.viewports;
      this.defaultViewport = config.defaultViewport;
      this.viewport(this.defaultViewport);

      _config.setConfig({
        viewport: this.defaultViewport
      });

      _underscore.each(this.viewports, function (viewport, name) {
        _this4.viewportClasses[name + "-viewport"] = _knockout.observable(name === _this4.defaultViewport);
      });
    };

    _createClass(PageBuilder, [{
      key: "viewportTemplate",
      get: function get() {
        return "Magento_PageBuilder/viewport/switcher";
      }
    }]);

    return PageBuilder;
  }();

  return PageBuilder;
});
//# sourceMappingURL=page-builder.js.map