/*eslint-disable */
define(["knockout", "mage/translate", "Magento_Ui/js/modal/alert", "underscore", "Magento_PageBuilder/js/collection", "Magento_PageBuilder/js/utils/array", "Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/component/data-store", "Magento_PageBuilder/js/component/event-bus", "Magento_PageBuilder/js/component/stage-builder", "Magento_PageBuilder/js/component/stage/master-format-renderer"], function (_knockout, _translate, _alert, _underscore, _collection, _array, _contentTypeFactory, _dataStore, _eventBus, _stageBuilder, _masterFormatRenderer) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var Stage =
  /*#__PURE__*/
  function () {
    /**
     * @param {PageBuilderInterface} parent
     */
    function Stage(parent) {
      this.parent = void 0;
      this.id = void 0;
      this.config = {
        name: "stage"
      };
      this.loading = _knockout.observable(true);
      this.showBorders = _knockout.observable(false);
      this.interacting = _knockout.observable(false);
      this.userSelect = _knockout.observable(true);
      this.stageLoadingMessage = (0, _translate)("Please hold! we're just retrieving your content...");
      this.store = new _dataStore();
      this.template = "Magento_PageBuilder/component/stage.html";
      this.masterFormatRenderer = new _masterFormatRenderer();
      this.collection = new _collection();
      this.parent = parent;
      this.id = parent.id;
      this.initListeners();
      (0, _stageBuilder)(this, parent.initialValue).then(this.ready.bind(this));
    }
    /**
     * Get template.
     *
     * @returns {string}
     */


    var _proto = Stage.prototype;

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

    /**
     * Init listeners
     */
    _proto.initListeners = function initListeners() {
      var _this = this;

      this.collection.getChildren().subscribe(function () {
        return _eventBus.trigger("stage:updated", {
          stageId: _this.id
        });
      }); // Block dropped from left hand panel

      _eventBus.on("block:dropped", function (event, params) {
        if (params.stageId === _this.id) {
          _this.onBlockDropped(event, params);
        }
      }); // Block instance being moved between structural elements


      _eventBus.on("block:instanceDropped", function (event, params) {
        if (params.stageId === _this.id) {
          _this.onBlockInstanceDropped(event, params);
        }
      }); // Block being removed from container


      _eventBus.on("block:removed", function (event, params) {
        if (params.stageId === _this.id) {
          _this.onBlockRemoved(event, params);
        }
      }); // Block sorted within the same structural element


      _eventBus.on("block:sorted", function (event, params) {
        if (params.stageId === _this.id) {
          _this.onBlockSorted(event, params);
        }
      }); // Observe sorting actions


      _eventBus.on("block:sortStart", function (event, params) {
        if (params.stageId === _this.id) {
          _this.onSortingStart(event, params);
        }
      });

      _eventBus.on("block:sortStop", function (event, params) {
        if (params.stageId === _this.id) {
          _this.onSortingStop(event, params);
        }
      }); // Any store state changes trigger a stage update event


      this.store.subscribe(function () {
        return _eventBus.trigger("stage:updated", {
          stageId: _this.id
        });
      }); // Watch for stage update events & manipulations to the store, debounce for 50ms as multiple stage changes
      // can occur concurrently.

      _eventBus.on("stage:updated", function (event, params) {
        if (params.stageId === _this.id) {
          _underscore.debounce(function () {
            _this.masterFormatRenderer.applyBindings(_this.children).then(function (renderedOutput) {
              return _eventBus.trigger("stage:renderTree:" + _this.id, {
                value: renderedOutput
              });
            });
          }, 500).call(_this);
        }
      });

      _eventBus.on("interaction:start", function () {
        return _this.interacting(true);
      });

      _eventBus.on("interaction:stop", function () {
        return _this.interacting(false);
      });
    };
    /**
     * On block removed
     *
     * @param event
     * @param params
     */


    _proto.onBlockRemoved = function onBlockRemoved(event, params) {
      params.parent.removeChild(params.block); // Remove the instance from the data store

      params.parent.store.remove(params.block.id);
    };
    /**
     * On instance of an existing block is dropped onto container
     *
     * @param {Event} event
     * @param {BlockInstanceDroppedParams} params
     */


    _proto.onBlockInstanceDropped = function onBlockInstanceDropped(event, params) {
      var originalParent = params.blockInstance.parent;
      params.blockInstance.parent = params.parent;
      params.parent.parent.addChild(params.blockInstance, params.index);

      _eventBus.trigger("block:moved", {
        block: params.blockInstance,
        index: params.index,
        newParent: params.parent,
        originalParent: originalParent
      });
    };
    /**
     * On block dropped into container
     *
     * @param {Event} event
     * @param {BlockDroppedParams} params
     */


    _proto.onBlockDropped = function onBlockDropped(event, params) {
      var index = params.index || 0;
      new Promise(function (resolve, reject) {
        if (params.block) {
          return (0, _contentTypeFactory)(params.block.config, params.parent, params.stageId).then(function (block) {
            params.parent.addChild(block, index);

            _eventBus.trigger("block:dropped:create", {
              id: block.id,
              block: block
            });

            _eventBus.trigger(params.block.config.name + ":block:dropped:create", {
              id: block.id,
              block: block
            });

            return block;
          });
        } else {
          reject("Parameter block missing from event.");
        }
      }).catch(function (error) {
        console.error(error);
      });
    };
    /**
     * On block sorted within it's own container
     *
     * @param {Event} event
     * @param {BlockSortedParams} params
     */


    _proto.onBlockSorted = function onBlockSorted(event, params) {
      var originalIndex = _knockout.utils.arrayIndexOf(params.parent.children(), params.block);

      if (originalIndex !== params.index) {
        (0, _array.moveArrayItem)(params.parent.children, originalIndex, params.index);
      }
    };
    /**
     * On sorting start
     *
     * @param {Event} event
     * @param {SortParamsInterface} params
     */


    _proto.onSortingStart = function onSortingStart(event, params) {
      this.showBorders(true);
    };
    /**
     * On sorting stop
     *
     * @param {Event} event
     * @param {SortParamsInterface} params
     */


    _proto.onSortingStop = function onSortingStop(event, params) {
      this.showBorders(false);
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
