/*eslint-disable */
define(["knockout", "mage/translate", "Magento_Ui/js/modal/alert", "underscore", "Magento_PageBuilder/js/component/data-store", "Magento_PageBuilder/js/component/event-bus", "Magento_PageBuilder/js/component/stage-builder", "Magento_PageBuilder/js/component/stage/event-handling-delegate", "Magento_PageBuilder/js/component/stage/save", "Magento_PageBuilder/js/collection"], function (_knockout, _translate, _alert, _underscore, _dataStore, _eventBus, _stageBuilder, _eventHandlingDelegate, _save, _collection) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var Stage =
  /*#__PURE__*/
  function () {
    /**
     * Constructor
     *
     * @param parent
     */
    function Stage(parent) {
      var _this = this;

      this.config = {
        name: "stage"
      };
      this.loading = void 0;
      this.parent = void 0;
      this.showBorders = _knockout.observable(false);
      this.interacting = _knockout.observable(false);
      this.userSelect = _knockout.observable(true);
      this.stageLoadingMessage = (0, _translate)("Please hold! we're just retrieving your content...");
      this.stage = void 0;
      this.store = void 0;
      this.template = "Magento_PageBuilder/component/stage.html";
      this.save = new _save();
      this.saveRenderTree = _underscore.debounce(function () {
        _this.save.renderTree(_this.children).then(function (renderedOutput) {
          return _eventBus.trigger("stage:renderTree:" + _this.id, {
            value: renderedOutput
          });
        });
      }, 500);
      this.collection = void 0;
      this.collection = new _collection();
      this.collection.getChildren().subscribe(function () {
        return _eventBus.trigger("stage:updated", {
          stageId: _this.stageId
        });
      });
      this.parent = parent;
      this.id = parent.id;
      this.loading = parent.loading;
      this.stage = this; // Create our state and store objects

      this.store = new _dataStore(); // Handle events for this stage instance

      (0, _eventHandlingDelegate.handleEvents)(this);
      this.initListeners();
      (0, _stageBuilder)(this, parent.initialValue).then(this.ready.bind(this));
    }
    /**
     * Init listeners.
     */


    var _proto = Stage.prototype;

    _proto.initListeners = function initListeners() {
      var _this2 = this;

      // Any store state changes trigger a stage update event
      this.store.subscribe(function () {
        return _eventBus.trigger("stage:updated", {
          stage: _this2
        });
      }); // Watch for stage update events & manipulations to the store, debounce for 50ms as multiple stage changes
      // can occur concurrently.

      _eventBus.on("stage:updated", function (event, params) {
        if (params.stageId === _this2.id) {
          _this2.saveRenderTree.call(_this2);
        }
      });

      _eventBus.on("interaction:start", function () {
        return _this2.interacting(true);
      });

      _eventBus.on("interaction:stop", function () {
        return _this2.interacting(false);
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
    /**
     * The stage has been initiated fully and is ready
     */


    _proto.ready = function ready() {
      _eventBus.trigger("stage:ready:" + this.id, {
        stage: this
      });

      this.collection.getChildren().valueHasMutated();
      this.loading(false);
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
