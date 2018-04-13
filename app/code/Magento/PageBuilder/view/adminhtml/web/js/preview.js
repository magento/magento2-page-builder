/*eslint-disable */
define(["jquery", "knockout", "mage/translate", "Magento_PageBuilder/js/modal/dismissible-confirm", "underscore", "Magento_PageBuilder/js/binding/live-edit", "Magento_PageBuilder/js/component/block/appearance-config", "Magento_PageBuilder/js/component/block/preview/sortable/binding", "Magento_PageBuilder/js/component/event-bus", "Magento_PageBuilder/js/component/format/style-attribute-filter", "Magento_PageBuilder/js/component/format/style-attribute-mapper", "Magento_PageBuilder/js/component/stage/edit", "Magento_PageBuilder/js/component/stage/structural/options", "Magento_PageBuilder/js/component/stage/structural/options/option", "Magento_PageBuilder/js/component/stage/structural/options/title"], function (_jquery, _knockout, _translate, _dismissibleConfirm, _underscore, _liveEdit, _appearanceConfig, _binding, _eventBus, _styleAttributeFilter, _styleAttributeMapper, _edit, _options, _option, _title) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var Preview =
  /*#__PURE__*/
  function () {
    /**
     * @deprecated
     */

    /**
     * @deprecated
     */

    /**
     * @param {ContentTypeInterface} parent
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    function Preview(parent, config, observableUpdater) {
      this.parent = void 0;
      this.config = void 0;
      this.data = {};
      this.displayLabel = void 0;
      this.edit = void 0;
      this.previewData = {};
      this.previewStyle = void 0;
      this.observableUpdater = void 0;
      this.mouseover = false;
      this.parent = parent;
      this.config = config;
      this.edit = new _edit(this.parent, this.parent.store);
      this.observableUpdater = observableUpdater;
      this.displayLabel = _knockout.observable(this.config.label);
      this.setupDataFields();
      this.bindEvents();
    }
    /**
     * Retrieve the preview template
     *
     * @returns {string}
     */


    var _proto = Preview.prototype;

    /**
     * Update data store
     *
     * @param {string} key
     * @param {string} value
     */
    _proto.updateData = function updateData(key, value) {
      var data = this.parent.store.get(this.parent.id);
      data[key] = value;
      this.parent.store.update(this.parent.id, data);
    };
    /**
     * Update the data value of a part of our internal Knockout data store
     *
     * @param {string} key
     * @param value
     * @deprecated
     */


    _proto.updateDataValue = function updateDataValue(key, value) {
      if (typeof this.previewData[key] !== "undefined" && _knockout.isObservable(this.previewData[key])) {
        this.previewData[key](value);
      } else {
        if (_underscore.isArray(value)) {
          this.previewData[key] = _knockout.observableArray(value);
        } else {
          this.previewData[key] = _knockout.observable(value);
        }
      }
    };
    /**
     * Set state based on mouseover event for the preview
     *
     * @param {Preview} context
     * @param {Event} event
     */


    _proto.onMouseOver = function onMouseOver(context, event) {
      if (this.mouseover) {
        return;
      }

      this.mouseover = true;
      var currentTarget = event.currentTarget;
      var optionsMenu = (0, _jquery)(currentTarget).find(".pagebuilder-options-wrapper");

      if (!(0, _jquery)(currentTarget).hasClass("type-nested")) {
        optionsMenu = optionsMenu.first();
      }

      optionsMenu.parent().addClass("pagebuilder-options-visible");
      (0, _jquery)(currentTarget).addClass("pagebuilder-content-type-active");
    };
    /**
     * Set state based on mouseout event for the preview
     *
     * @param {Preview} context
     * @param {Event} event
     */


    _proto.onMouseOut = function onMouseOut(context, event) {
      var _this = this;

      this.mouseover = false;

      _underscore.delay(function () {
        if (!_this.mouseover) {
          var currentTarget = event.currentTarget;
          var optionsMenu = (0, _jquery)(currentTarget).find(".pagebuilder-options-wrapper");

          if (!(0, _jquery)(currentTarget).hasClass("type-nested")) {
            optionsMenu = optionsMenu.first();
          }

          optionsMenu.parent().removeClass("pagebuilder-options-visible");
          (0, _jquery)(currentTarget).removeClass("pagebuilder-content-type-active");
        }
      }, 100); // 100 ms delay to allow for users hovering over other elements

    };
    /**
     * After children render fire an event
     *
     * @param {Element} element
     * @deprecated
     */


    _proto.afterChildrenRender = function afterChildrenRender(element) {
      _eventBus.trigger("block:childrenRendered", {
        id: this.parent.id,
        block: this.parent,
        element: element
      });

      _eventBus.trigger(this.parent.config.name + ":block:childrenRendered", {
        block: this.parent,
        element: element,
        id: this.parent.id
      });
    };
    /**
     * Get the options instance
     *
     * @returns {Options}
     */


    _proto.getOptions = function getOptions() {
      return new _options.Options(this, this.retrieveOptions());
    };
    /**
     * Return an array of options
     *
     * @returns {Array<OptionInterface>}
     */


    _proto.retrieveOptions = function retrieveOptions() {
      return [new _option.Option(this, "move", "<i class='icon-admin-pagebuilder-handle'></i>", (0, _translate)("Move"), null, ["move-structural"], 10), new _title.TitleOption(this, this.config.label, 20), new _option.Option(this, "edit", "<i class='icon-admin-pagebuilder-systems'></i>", (0, _translate)("Edit"), this.onOptionEdit, ["edit-block"], 30), new _option.Option(this, "duplicate", "<i class='icon-pagebuilder-copy'></i>", (0, _translate)("Duplicate"), this.onOptionDuplicate, ["duplicate-structural"], 40), new _option.Option(this, "remove", "<i class='icon-admin-pagebuilder-remove'></i>", (0, _translate)("Remove"), this.onOptionRemove, ["remove-structural"], 50)];
    };
    /**
     * Handle user editing an instance
     */


    _proto.onOptionEdit = function onOptionEdit() {
      this.edit.open();
    };
    /**
     * Handle duplicate of items
     */


    _proto.onOptionDuplicate = function onOptionDuplicate() {
      this.clone(this.parent);
    };
    /**
     * Duplicate a child of the current instance
     *
     * @param {ContentTypeInterface} child
     * @param {boolean} autoAppend
     * @returns {ContentTypeInterface}
     */


    _proto.clone = function clone(child, autoAppend) {
      if (autoAppend === void 0) {
        autoAppend = true;
      }

      var store = child.store;
      var instance = child.constructor;
      var duplicate = new instance(child.parent, child.config, child.stageId, child.content.getData(), child.previewBuilder, child.contentBuilder);
      var index = child.parent.children.indexOf(child) + 1 || null; // Copy the data from the data store

      store.update(duplicate.id, Object.assign({}, store.get(child.id))); // Duplicate the instances children into the new duplicate

      if (typeof child.children === "function" && child.children().length > 0) {
        child.children().forEach(function (subChild, childIndex) {
          /*
          duplicate.addChild(
              this.clone(subChild, false),
              childIndex,
          );
          */
          var createDuplicate = duplicate.preview.clone(subChild, false);

          if (createDuplicate) {
            duplicate.addChild(createDuplicate, childIndex);
          }
        });
      } // As a new block is being created, we need to fire that event as well


      _eventBus.trigger("block:create", {
        id: duplicate.id,
        block: duplicate
      });

      _eventBus.trigger(child.parent.config.name + ":block:create", {
        id: duplicate.id,
        block: duplicate
      });

      _eventBus.trigger("block:duplicate", {
        original: child,
        duplicate: duplicate,
        index: index
      });

      _eventBus.trigger(child.parent.config.name + ":block:duplicate", {
        original: child,
        duplicate: duplicate,
        index: index
      });

      if (autoAppend) {
        child.parent.addChild(duplicate, index);
      }

      return duplicate;
    };
    /**
     * Handle block removal
     */


    _proto.onOptionRemove = function onOptionRemove() {
      var _this2 = this;

      var removeBlock = function removeBlock() {
        var params = {
          block: _this2.parent,
          index: _this2.parent.parent.getChildren().indexOf(_this2.parent),
          parent: _this2.parent.parent,
          stageId: _this2.parent.stageId
        };

        _eventBus.trigger("block:removed", params);

        _eventBus.trigger(_this2.parent.config.name + ":block:removed", params);
      };

      if (this.isConfigured()) {
        (0, _dismissibleConfirm)({
          actions: {
            confirm: function confirm() {
              // Call the parent to remove the child element
              removeBlock();
            }
          },
          content: (0, _translate)("Are you sure you want to remove this item? The data within this item is not recoverable once removed."),
          // tslint:disable-line:max-line-length
          dismissKey: "pagebuilder_modal_dismissed",
          dismissible: true,
          title: (0, _translate)("Confirm Item Removal")
        });
      } else {
        removeBlock();
      }
    };
    /**
     * Event called when starting starts on this element
     *
     * @param event
     * @param params
     */


    _proto.onSortStart = function onSortStart(event, params) {
      if (params.block.id === this.id) {
        var originalEle = jQuery(params.originalEle);
        originalEle.show();
        originalEle.addClass("pagebuilder-sorting-original"); // Reset the width & height of the helper

        jQuery(params.helper).css({
          width: "",
          height: ""
        }).html(jQuery("<h3 />").text(this.title).html());
      }
    };
    /**
     * Bind events for the current instance
     */


    _proto.bindEvents = function bindEvents() {
      var _this3 = this;

      _eventBus.on("block:sortStart", this.onSortStart.bind(this.parent));

      this.parent.store.subscribe(function (data) {
        _this3.observableUpdater.update(_this3, _underscore.extend({}, _this3.parent.store.get(_this3.parent.id)));

        _eventBus.trigger("previewObservables:updated", {
          preview: _this3
        });
      }, this.parent.id);
    };
    /**
     * Setup fields observables within the data class property
     *
     * @deprecated
     */


    _proto.setupDataFields = function setupDataFields() {
      var _this4 = this;

      var styleAttributeMapper = new _styleAttributeMapper();
      var styleAttributeFilter = new _styleAttributeFilter(); // Create an empty observable for all fields

      if (this.config.fields) {
        _underscore.keys(this.config.fields).forEach(function (key) {
          _this4.updateDataValue(key, "");
        });
      } // Subscribe to this blocks data in the store


      this.parent.store.subscribe(function (data) {
        _underscore.forEach(data, function (value, key) {
          _this4.updateDataValue(key, value);
        });
      }, this.parent.id); // Calculate the preview style utilising the style attribute mapper & appearance system

      this.previewStyle = _knockout.computed(function () {
        var data = _underscore.mapObject(_this4.previewData, function (value) {
          if (_knockout.isObservable(value)) {
            return value();
          }

          return value;
        });

        if (typeof data.appearance !== "undefined" && typeof _this4.config.appearances !== "undefined" && typeof _this4.config.appearances[data.appearance] !== "undefined") {
          _underscore.extend(data, _this4.config.appearances[data.appearance]);
        } // Extract data values our of observable functions


        return _this4.afterStyleMapped(styleAttributeMapper.toDom(styleAttributeFilter.filter(data)));
      });
      Object.keys(styleAttributeFilter.getAllowedAttributes()).forEach(function (key) {
        if (_knockout.isObservable(_this4.previewData[key])) {
          _this4.previewData[key].subscribe(function () {
            _this4.previewStyle.notifySubscribers();
          });
        }
      });
    };
    /**
     * Callback function to update the styles are mapped
     *
     * @param {StyleAttributeMapperResult} styles
     * @returns {StyleAttributeMapperResult}
     * @deprecated
     */


    _proto.afterStyleMapped = function afterStyleMapped(styles) {
      return styles;
    };
    /**
     * Does the current instance have any children or values different from the default for it's type?
     *
     * @returns {boolean}
     */


    _proto.isConfigured = function isConfigured() {
      var data = this.parent.store.get(this.parent.id);
      var hasDataChanges = false;

      _underscore.each(this.parent.config.fields, function (field, key) {
        var fieldValue = data[key];

        if (!fieldValue) {
          fieldValue = "";
        } // Default values can only ever be strings


        if (_underscore.isObject(fieldValue)) {
          // Empty arrays as default values appear as empty strings
          if (_underscore.isArray(fieldValue) && fieldValue.length === 0) {
            fieldValue = "";
          } else {
            fieldValue = JSON.stringify(fieldValue);
          }
        }

        if (_underscore.isObject(field.default)) {
          if (JSON.stringify(field.default) !== fieldValue) {
            hasDataChanges = true;
          }
        } else if (field.default !== fieldValue) {
          hasDataChanges = true;
        }

        return;
      });

      return hasDataChanges;
    };

    _createClass(Preview, [{
      key: "previewTemplate",
      get: function get() {
        var appearance = this.previewData.appearance ? this.previewData.appearance() : undefined;
        return (0, _appearanceConfig)(this.config.name, appearance).preview_template;
      }
      /**
       * Retrieve the preview child template
       *
       * @returns {string}
       */

    }, {
      key: "previewChildTemplate",
      get: function get() {
        return "Magento_PageBuilder/component/block/preview/children.html";
      }
    }]);

    return Preview;
  }();

  return Preview;
});
//# sourceMappingURL=preview.js.map
