/*eslint-disable */
define(["knockout", "mage/translate", "Magento_Ui/js/modal/alert", "uiEvents", "underscore", "Magento_PageBuilder/js/component/data-store", "Magento_PageBuilder/js/component/stage-builder", "Magento_PageBuilder/js/component/stage/event-handling-delegate", "Magento_PageBuilder/js/component/stage/save", "Magento_PageBuilder/js/component/stage/structural/editable-area"], function (_knockout, _translate, _alert, _uiEvents, _underscore, _dataStore, _stageBuilder, _eventHandlingDelegate, _save, _editableArea) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Stage =
  /*#__PURE__*/
  function (_EditableArea) {
    _inheritsLoose(Stage, _EditableArea);

    /**
     * Constructor
     *
     * @param parent
     */
    function Stage(parent) {
      var _this;

      _this = _EditableArea.call(this) || this;
      _this.config = {
        name: "stage"
      };
      _this.loading = void 0;
      _this.parent = void 0;
      _this.showBorders = _knockout.observable(false);
      _this.interacting = _knockout.observable(false);
      _this.userSelect = _knockout.observable(true);
      _this.stageLoadingMessage = (0, _translate)("Please hold! we're just retrieving your content...");
      _this.stage = void 0;
      _this.store = void 0;
      _this.template = "Magento_PageBuilder/component/stage.html";
      _this.save = new _save();
      _this.saveRenderTree = _underscore.debounce(function () {
        _this.save.renderTree(_this.children).then(function (renderedOutput) {
          return _uiEvents.trigger("stage:renderTree:" + _this.id, {
            value: renderedOutput
          });
        });
      }, 500);
      _this.parent = parent;
      _this.id = parent.id;
      _this.loading = parent.loading;
      _this.stage = _this;

      _this.setChildren(); // Create our state and store objects


      _this.store = new _dataStore(); // Handle events for this stage instance

      (0, _eventHandlingDelegate.handleEvents)(_this);

      _this.initListeners();

      (0, _stageBuilder)(_this, parent.initialValue).then(_this.ready.bind(_this));
      return _this;
    }
    /**
     * Init listeners.
     */


    var _proto = Stage.prototype;

    _proto.initListeners = function initListeners() {
      var _this2 = this;

      // Any store state changes trigger a stage update event
      this.store.subscribe(function () {
        return _uiEvents.trigger("stage:updated", {
          stage: _this2
        });
      }); // Watch for stage update events & manipulations to the store, debounce for 50ms as multiple stage changes
      // can occur concurrently.

      _uiEvents.on("stage:updated", function (args) {
        if (args.stage.id === _this2.id) {
          _this2.saveRenderTree.call(_this2);
        }
      });

      _uiEvents.on("interaction:start", function () {
        return _this2.interacting(true);
      });

      _uiEvents.on("interaction:stop", function () {
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
      _uiEvents.trigger("stage:ready:" + this.id, {
        stage: this
      });

      this.children.valueHasMutated();
      this.loading(false);
    };
    /**
     * Remove a child from the observable array
     *
     * @param child
     */


    _proto.removeChild = function removeChild(child) {
      if (this.children().length === 1) {
        (0, _alert)({
          content: (0, _translate)("You are not able to remove the final row from the content."),
          title: (0, _translate)("Unable to Remove")
        });
        return;
      }

      _EditableArea.prototype.removeChild.call(this, child);
    };

    return Stage;
  }(_editableArea);

  return Stage;
});
//# sourceMappingURL=stage.js.map
