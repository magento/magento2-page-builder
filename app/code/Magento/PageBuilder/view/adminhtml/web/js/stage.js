/*eslint-disable */
define(["knockout", "mage/translate", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/resource/jquery/ui/jquery.ui.touch-punch.min", "Magento_Ui/js/modal/alert", "underscore", "Magento_PageBuilder/js/binding/sortable", "Magento_PageBuilder/js/collection", "Magento_PageBuilder/js/data-store", "Magento_PageBuilder/js/drag-drop/matrix", "Magento_PageBuilder/js/drag-drop/sortable", "Magento_PageBuilder/js/master-format/render", "Magento_PageBuilder/js/stage-builder", "Magento_PageBuilder/js/utils/promise-deferred"], function (_knockout, _translate, _events, _jqueryUiTouchPunch, _alert, _underscore, _sortable, _collection, _dataStore, _matrix, _sortable2, _render, _stageBuilder, _promiseDeferred) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var Stage =
  /*#__PURE__*/
  function () {
    /**
     * Debounce the applyBindings call by 500ms to stop duplicate calls
     *
     * @type {(() => void) & _.Cancelable}
     */

    /**
     * @param {PageBuilderInterface} parent
     */
    function Stage(parent) {
      var _this = this;

      this.parent = void 0;
      this.id = void 0;
      this.config = {
        name: "stage",
        type: "restricted-container",
        accepts: ["row"]
      };
      this.loading = _knockout.observable(true);
      this.showBorders = _knockout.observable(false);
      this.interacting = _knockout.observable(false);
      this.userSelect = _knockout.observable(true);
      this.focusChild = _knockout.observable(false);
      this.stageLoadingMessage = (0, _translate)("Please hold! we're just retrieving your content...");
      this.dataStore = new _dataStore();
      this.afterRenderDeferred = (0, _promiseDeferred)();
      this.template = "Magento_PageBuilder/content-type/preview";
      this.render = new _render();
      this.collection = new _collection();
      this.applyBindingsDebounce = _underscore.debounce(function () {
        _this.render.applyBindings(_this.children).then(function (renderedOutput) {
          return _events.trigger("stage:" + _this.id + ":masterFormatRenderAfter", {
            value: renderedOutput
          });
        });
      }, 500);
      this.parent = parent;
      this.id = parent.id;
      (0, _matrix.generateAllowedParents)();
    }
    /**
     * On render build the stage and init any event listeners
     */


    var _proto = Stage.prototype;

    _proto.onRender = function onRender() {
      Promise.all([(0, _stageBuilder)(this, this.parent.initialValue), this.afterRenderDeferred.promise]).then(this.ready.bind(this));
    };
    /**
     * Get template.
     *
     * @returns {string}
     */


    _proto.getTemplate = function getTemplate() {
      return this.template;
    };
    /**
     * The stage has been initiated fully and is ready
     */


    _proto.ready = function ready() {
      _events.trigger("stage:" + this.id + ":readyAfter", {
        stage: this
      });

      this.loading(false);
      this.initListeners();
    };
    /**
     * Remove a child from the observable array
     *
     * @param child
     */


    _proto.removeChild = function removeChild(child) {
      if (this.collection.getChildren().length === 1) {
        (0, _alert)({
          content: (0, _translate)("You are not able to remove the final row from the content."),
          title: (0, _translate)("Unable to Remove")
        });
        return;
      }

      this.collection.removeChild(child);
    };
    /**
     * Return the children of the current element
     *
     * @returns {KnockoutObservableArray<ContentTypeInterface>}
     */


    _proto.getChildren = function getChildren() {
      return this.collection.getChildren();
    };
    /**
     * Add a child into the observable array
     *
     * @param child
     * @param index
     */


    _proto.addChild = function addChild(child, index) {
      child.parent = this;
      this.collection.addChild(child, index);
    };
    /**
     * Set the children observable array into the class
     *
     * @param children
     */


    _proto.setChildren = function setChildren(children) {
      this.collection.setChildren(children);
    };

    /**
     * Determine if the container can receive drop events?
     *
     * @returns {boolean}
     */
    _proto.isContainer = function isContainer() {
      return true;
    };
    /**
     * Return the sortable options
     *
     * @returns {JQueryUI.SortableOptions}
     */


    _proto.getSortableOptions = function getSortableOptions() {
      return (0, _sortable2.getSortableOptions)(this);
    };
    /**
     * Init listeners
     */


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
          _this2.applyBindingsDebounce();
        }
      });

      var interactionLevel = 0;

      _events.on("stage:interactionStart", function () {
        ++interactionLevel;

        _this2.interacting(true);
      });

      _events.on("stage:interactionStop", function (args) {
        var forced = _underscore.isObject(args) && args.force === true;

        if (--interactionLevel === 0 || forced) {
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
    };
    /**
     * On content type removed
     *
     * @param params
     */


    _proto.onContentTypeRemoved = function onContentTypeRemoved(params) {
      params.parent.removeChild(params.contentType);
    };

    _createClass(Stage, [{
      key: "children",
      get: function get() {
        return this.collection.getChildren();
      }
    }]);

    return Stage;
  }();

  return Stage;
});
//# sourceMappingURL=stage.js.map
