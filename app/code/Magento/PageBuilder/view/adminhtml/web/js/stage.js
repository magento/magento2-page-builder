/*eslint-disable */
define(["knockout", "mage/translate", "Magento_Ui/js/modal/alert", "uiEvents", "underscore", "Magento_PageBuilder/js/collection", "Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/data-store", "Magento_PageBuilder/js/master-format/render", "Magento_PageBuilder/js/stage-builder", "Magento_PageBuilder/js/utils/array"], function (_knockout, _translate, _alert, _uiEvents, _underscore, _collection, _contentTypeFactory, _dataStore, _render, _stageBuilder, _array) {
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
      this.dataStore = new _dataStore();
      this.template = "Magento_PageBuilder/content-type/preview";
      this.render = new _render();
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
     * Init listeners
     */
    _proto.initListeners = function initListeners() {
      var _this = this;

      this.collection.getChildren().subscribe(function () {
        return _uiEvents.trigger("stage:updated", {
          stageId: _this.id
        });
      }); // ContentType dropped from left hand panel

      _uiEvents.on("contentType:dropped", function (args) {
        if (args.stageId === _this.id) {
          _this.onContentTypeDropped(args);
        }
      }); // ContentType instance being moved between structural elements


      _uiEvents.on("contentType:instanceDropped", function (args) {
        if (args.stageId === _this.id) {
          _this.onContentTypeInstanceDropped(args);
        }
      }); // ContentType being removed from container


      _uiEvents.on("contentType:removed", function (args) {
        if (args.stageId === _this.id) {
          _this.onContentTypeRemoved(args);
        }
      }); // ContentType sorted within the same structural element


      _uiEvents.on("contentType:sorted", function (args) {
        if (args.stageId === _this.id) {
          _this.onContentTypeSorted(args);
        }
      }); // Observe sorting actions


      _uiEvents.on("contentType:sortStart", function (args) {
        if (args.stageId === _this.id) {
          _this.onSortingStart(args);
        }
      });

      _uiEvents.on("contentType:sortStop", function (args) {
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
     * On content type removed
     *
     * @param event
     * @param params
     */


    _proto.onContentTypeRemoved = function onContentTypeRemoved(params) {
      params.parent.removeChild(params.contentType);
    };
    /**
     * On instance of an existing content type is dropped onto container
     *
     * @param {ContentTypeInstanceDroppedParamsInterface} params
     */


    _proto.onContentTypeInstanceDropped = function onContentTypeInstanceDropped(params) {
      var originalParent = params.contentTypeInstance.parent;
      params.contentTypeInstance.parent = params.parent;
      params.parent.parent.addChild(params.contentTypeInstance, params.index);

      _uiEvents.trigger("contentType:moved", {
        contentType: params.contentTypeInstance,
        index: params.index,
        newParent: params.parent,
        originalParent: originalParent
      });
    };
    /**
     * On content type dropped into container
     *
     * @param {ContentTypeDroppedParamsInterface} params
     */


    _proto.onContentTypeDropped = function onContentTypeDropped(params) {
      var index = params.index || 0;
      new Promise(function (resolve, reject) {
        if (params.contentType) {
          return (0, _contentTypeFactory)(params.contentType.config, params.parent, params.stageId).then(function (contentType) {
            params.parent.addChild(contentType, index);

            _uiEvents.trigger("contentType:dropped:create", {
              id: contentType.id,
              contentType: contentType
            });

            _uiEvents.trigger(params.contentType.config.name + ":contentType:dropped:create", {
              id: contentType.id,
              contentType: contentType
            });

            return contentType;
          });
        } else {
          reject("Parameter content type missing from event.");
        }
      }).catch(function (error) {
        console.error(error);
      });
    };
    /**
     * On content type sorted within it's own container
     *
     * @param {ContentTypeSortedParams} params
     */


    _proto.onContentTypeSorted = function onContentTypeSorted(params) {
      var originalIndex = _knockout.utils.arrayIndexOf(params.parent.children(), params.contentType);

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
