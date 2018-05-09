/*eslint-disable */
define(["knockout", "mage/translate", "Magento_Ui/js/modal/alert", "uiEvents", "underscore", "Magento_PageBuilder/js/collection", "Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/content-type/preview-sortable-options", "Magento_PageBuilder/js/data-store", "Magento_PageBuilder/js/master-format/render", "Magento_PageBuilder/js/stage-builder", "Magento_PageBuilder/js/utils/array"], function (_knockout, _translate, _alert, _uiEvents, _underscore, _collection, _contentTypeFactory, _previewSortableOptions, _dataStore, _render, _stageBuilder, _array) {
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
        name: "stage",
        type: "restricted-container",
        accepts: ["row"]
      };
      this.loading = _knockout.observable(true);
      this.showBorders = _knockout.observable(false);
      this.interacting = _knockout.observable(false);
      this.userSelect = _knockout.observable(true);
      this.stageLoadingMessage = (0, _translate)("Please hold! we're just retrieving your content...");
      this.dataStore = new _dataStore();
      this.template = "Magento_PageBuilder/content-type/preview";
      this.render = new _render();
      this.collection = new _collection();
      this.parent = parent;
      this.id = parent.id;
      this.initListeners();
      (0, _stageBuilder)(this, parent.initialValue).then(this.ready.bind(this));
      (0, _previewSortableOptions.generateContainerAcceptedMatrix)();
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
      _uiEvents.trigger("stage:ready:" + this.id, {
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
     * Determine if the container can receive drop events?
     *
     * @returns {boolean}
     */
    _proto.canReceiveDrops = function canReceiveDrops() {
      return true;
    };
    /**
     * Return the sortable options
     *
     * @returns {JQueryUI.SortableOptions}
     */


    _proto.getSortableOptions = function getSortableOptions() {
      return (0, _previewSortableOptions.getSortableOptions)(this);
    };
    /**
     * Init listeners
     */


    _proto.initListeners = function initListeners() {
      var _this = this;

      this.collection.getChildren().subscribe(function () {
        return _uiEvents.trigger("stage:updated", {
          stageId: _this.id
        });
      }); // Block dropped from left hand panel

      _uiEvents.on("block:dropped", function (args) {
        if (args.stageId === _this.id) {
          _this.onBlockDropped(args);
        }
      }); // Block instance being moved between structural elements


      _uiEvents.on("block:instanceDropped", function (args) {
        if (args.stageId === _this.id) {
          _this.onBlockInstanceDropped(args);
        }
      }); // Block being removed from container


      _uiEvents.on("block:removed", function (args) {
        if (args.stageId === _this.id) {
          _this.onBlockRemoved(args);
        }
      }); // Block sorted within the same structural element


      _uiEvents.on("block:sorted", function (args) {
        if (args.stageId === _this.id) {
          _this.onBlockSorted(args);
        }
      }); // Observe sorting actions


      _uiEvents.on("block:sortStart", function (args) {
        if (args.stageId === _this.id) {
          _this.onSortingStart(args);
        }
      });

      _uiEvents.on("block:sortStop", function (args) {
        if (args.stageId === _this.id) {
          _this.onSortingStop(args);
        }
      }); // Any store state changes trigger a stage update event


      this.dataStore.subscribe(function () {
        return _uiEvents.trigger("stage:updated", {
          stageId: _this.id
        });
      }); // Watch for stage update events & manipulations to the store, debounce for 50ms as multiple stage changes
      // can occur concurrently.

      _uiEvents.on("stage:updated", function (args) {
        if (args.stageId === _this.id) {
          _underscore.debounce(function () {
            _this.render.applyBindings(_this.children).then(function (renderedOutput) {
              return _uiEvents.trigger("stage:renderTree:" + _this.id, {
                value: renderedOutput
              });
            });
          }, 500).call(_this);
        }
      });

      _uiEvents.on("interaction:start", function () {
        return _this.interacting(true);
      });

      _uiEvents.on("interaction:stop", function () {
        return _this.interacting(false);
      });
    };
    /**
     * On block removed
     *
     * @param event
     * @param params
     */


    _proto.onBlockRemoved = function onBlockRemoved(params) {
      params.parent.removeChild(params.block);
    };
    /**
     * On instance of an existing block is dropped onto container
     *
     * @param {Event} event
     * @param {BlockInstanceDroppedParams} params
     */


    _proto.onBlockInstanceDropped = function onBlockInstanceDropped(params) {
      var originalParent = params.blockInstance.parent;
      params.blockInstance.parent = params.parent;
      params.parent.parent.addChild(params.blockInstance, params.index);

      _uiEvents.trigger("block:moved", {
        block: params.blockInstance,
        index: params.index,
        newParent: params.parent,
        originalParent: originalParent
      });
    };
    /**
     * On block dropped into container
     *
     * @param {BlockDroppedParams} params
     */


    _proto.onBlockDropped = function onBlockDropped(params) {
      var index = params.index || 0;
      new Promise(function (resolve, reject) {
        if (params.blockConfig) {
          return (0, _contentTypeFactory)(params.blockConfig, params.parent, params.stageId).then(function (block) {
            params.parent.addChild(block, index);

            _uiEvents.trigger("block:dropped:create", {
              id: block.id,
              block: block
            });

            _uiEvents.trigger(params.blockConfig.name + ":block:dropped:create", {
              id: block.id,
              block: block
            });

            return block;
          });
        } else {
          reject("Parameter blockConfig missing from event.");
        }
      }).catch(function (error) {
        console.error(error);
      });
    };
    /**
     * On block sorted within it's own container
     *
     * @param {BlockSortedParams} params
     */


    _proto.onBlockSorted = function onBlockSorted(params) {
      var originalIndex = _knockout.utils.arrayIndexOf(params.parent.children(), params.block);

      if (originalIndex !== params.index) {
        (0, _array.moveArrayItem)(params.parent.children, originalIndex, params.index);
      }
    };
    /**
     * On sorting start
     *
     * @param {SortParamsInterface} params
     */


    _proto.onSortingStart = function onSortingStart(params) {
      this.showBorders(true);
    };
    /**
     * On sorting stop
     *
     * @param {SortParamsInterface} params
     */


    _proto.onSortingStop = function onSortingStop(params) {
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
