/*eslint-disable */
/* jscs:disable */
define(["jquery", "knockout", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/resource/jquery/ui/jquery.ui.touch-punch", "mageUtils", "underscore", "Magento_PageBuilder/js/binding/sortable", "Magento_PageBuilder/js/collection", "Magento_PageBuilder/js/data-store", "Magento_PageBuilder/js/drag-drop/matrix", "Magento_PageBuilder/js/master-format/render", "Magento_PageBuilder/js/stage-builder", "Magento_PageBuilder/js/utils/promise-deferred"], function (_jquery, _knockout, _events, _jqueryUi, _mageUtils, _underscore, _sortable, _collection, _dataStore, _matrix, _render, _stageBuilder, _promiseDeferred) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Stage =
  /*#__PURE__*/
  function () {
    "use strict";

    /**
     * We always complete a single render when the stage is first loaded, so we can set the lock when the stage is
     * created. The lock is used to halt the parent forms submission when Page Builder is rendering.
     */

    /**
     * Debounce the applyBindings call by 500ms to stop duplicate calls
     *
     * @type {(() => void) & _.Cancelable}
     */

    /**
     * @param {PageBuilderInterface} pageBuilder
     * @param {ContentTypeCollectionInterface} rootContainer
     */
    function Stage(pageBuilder, rootContainer) {
      var _this = this;

      this.loading = _knockout.observable(true);
      this.showBorders = _knockout.observable(false);
      this.interacting = _knockout.observable(false);
      this.userSelect = _knockout.observable(true);
      this.focusChild = _knockout.observable(false);
      this.dataStore = new _dataStore();
      this.afterRenderDeferred = (0, _promiseDeferred)();
      this.renderingLocks = [];
      this.template = "Magento_PageBuilder/content-type/preview";
      this.collection = new _collection();
      this.applyBindingsDebounce = _underscore.debounce(function (renderId) {
        _this.render.applyBindings(_this.rootContainer).then(function (renderedOutput) {
          if (_this.lastRenderId === renderId) {
            _events.trigger("stage:" + _this.id + ":masterFormatRenderAfter", {
              value: renderedOutput
            });

            _this.renderingLocks.forEach(function (lock) {
              lock.resolve(renderedOutput);
            });
          }
        }).catch(function (error) {
          if (error) {
            console.error(error);
          }
        });
      }, 500);
      this.pageBuilder = pageBuilder;
      this.id = pageBuilder.id;
      this.render = new _render(pageBuilder.id);
      this.rootContainer = rootContainer;
      (0, _matrix.generateAllowedParents)(); // Fire an event after the DOM has rendered

      this.afterRenderDeferred.promise.then(function () {
        _this.render.setupChannel();

        _events.trigger("stage:" + _this.id + ":renderAfter", {
          stage: _this
        });
      }); // Wait for the stage to be built alongside the stage being rendered

      Promise.all([(0, _stageBuilder)(this, this.pageBuilder.initialValue), this.afterRenderDeferred.promise]).then(this.ready.bind(this)).catch(function (error) {
        console.error(error);
      });
    }
    /**
     * Get template.
     *
     * @returns {string}
     */


    var _proto = Stage.prototype;

    _proto.getTemplate = function getTemplate() {
      return this.template;
    }
    /**
     * The stage has been initiated fully and is ready
     */
    ;

    _proto.ready = function ready() {
      _events.trigger("stage:" + this.id + ":readyAfter", {
        stage: this
      });

      this.loading(false);
      this.initListeners(); // Ensure we complete an initial save of the data within the stage once we're ready

      _events.trigger("stage:updateAfter", {
        stageId: this.id
      });
    }
    /**
     * Init listeners
     */
    ;

    _proto.initListeners = function initListeners() {
      var _this2 = this;

      this.collection.getChildren().subscribe(function () {
        return _events.trigger("stage:updateAfter", {
          stageId: _this2.id
        });
      }); // ContentType being removed from container

      _events.on("contentType:removeAfter", function (args) {
        if (args.stageId === _this2.id) {
          _this2.onContentTypeRemoved(args);
        }
      }); // Any store state changes trigger a stage update event


      this.dataStore.subscribe(function () {
        return _events.trigger("stage:updateAfter", {
          stageId: _this2.id
        });
      }); // Watch for stage update events & manipulations to the store, debounce for 50ms as multiple stage changes
      // can occur concurrently.

      _events.on("stage:updateAfter", function (args) {
        if (args.stageId === _this2.id) {
          // Create the rendering lock straight away
          _this2.createLock();

          var renderId = _mageUtils.uniqueid();

          _this2.lastRenderId = renderId;

          _this2.applyBindingsDebounce(renderId);
        }
      });

      var interactionLevel = 0;

      _events.on("stage:interactionStart", function () {
        ++interactionLevel;

        _this2.interacting(true);
      });

      _events.on("stage:interactionStop", function (args) {
        var forced = _underscore.isObject(args) && args.force === true;
        interactionLevel = Math.max(interactionLevel - 1, 0);

        if (interactionLevel === 0 || forced) {
          _this2.interacting(false);

          if (forced) {
            interactionLevel = 0;
          }
        }
      });

      _events.on("stage:childFocusStart", function () {
        return _this2.focusChild(true);
      });

      _events.on("stage:childFocusStop", function () {
        return _this2.focusChild(false);
      });
    }
    /**
     * Create a new lock for rendering
     */
    ;

    _proto.createLock = function createLock() {
      this.renderingLocks.push(_jquery.Deferred());
    }
    /**
     * On content type removed
     *
     * @param params
     */
    ;

    _proto.onContentTypeRemoved = function onContentTypeRemoved(params) {
      if (params.parentContentType) {
        params.parentContentType.removeChild(params.contentType);
      }
    };

    return Stage;
  }();

  Stage.rootContainerName = "root-container";
  return Stage;
});
//# sourceMappingURL=stage.js.map