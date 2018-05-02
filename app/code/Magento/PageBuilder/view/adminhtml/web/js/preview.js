/*eslint-disable */
define(["jquery", "knockout", "mage/translate", "Magento_PageBuilder/js/modal/dismissible-confirm", "uiEvents", "underscore", "Magento_PageBuilder/js/binding/live-edit", "Magento_PageBuilder/js/component/block/appearance-config", "Magento_PageBuilder/js/component/block/preview/sortable/binding", "Magento_PageBuilder/js/component/format/style-attribute-filter", "Magento_PageBuilder/js/component/format/style-attribute-mapper", "Magento_PageBuilder/js/component/stage/edit", "Magento_PageBuilder/js/component/stage/structural/options", "Magento_PageBuilder/js/component/stage/structural/options/option", "Magento_PageBuilder/js/component/stage/structural/options/title", "Magento_PageBuilder/js/content-type-factory"], function (_jquery, _knockout, _translate, _dismissibleConfirm, _uiEvents, _underscore, _liveEdit, _appearanceConfig, _binding, _styleAttributeFilter, _styleAttributeMapper, _edit, _options, _option, _title, _contentTypeFactory) {
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
      this.previewData = {};
      this.previewStyle = void 0;
      this.fieldsToIgnoreOnRemove = [];
      this.edit = void 0;
      this.observableUpdater = void 0;
      this.mouseover = false;
      this.mouseoverContext = void 0;
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
      this.mouseoverContext = context;
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
        if (!_this.mouseover && _this.mouseoverContext === context) {
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
      _uiEvents.trigger("block:childrenRendered", {
        id: this.parent.id,
        block: this.parent,
        element: element
      });

      _uiEvents.trigger(this.parent.config.name + ":block:childrenRendered", {
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
     * Duplicate content type
     *
     * @param {ContentTypeInterface} contentType
     * @param {boolean} autoAppend
     * @returns {Promise<ContentTypeInterface>}
     */


    _proto.clone = function clone(contentType, autoAppend) {
      var _this2 = this;

      if (autoAppend === void 0) {
        autoAppend = true;
      }

      var contentBlockData = contentType.store.get(contentType.id);
      var index = contentType.parent.collection.children.indexOf(contentType) + 1 || null;
      return new Promise(function (resolve, reject) {
        (0, _contentTypeFactory)(contentType.config, contentType.parent, contentType.stageId, contentBlockData).then(function (duplicateBlock) {
          if (autoAppend) {
            contentType.parent.addChild(duplicateBlock, index);
          }

          _this2.dispatchContentTypeCloneEvents(contentType, duplicateBlock, index);

          resolve(duplicateBlock);
        });
      });
    };
    /**
     * Handle block removal
     */


    _proto.onOptionRemove = function onOptionRemove() {
      var _this3 = this;

      var removeBlock = function removeBlock() {
        var params = {
          block: _this3.parent,
          index: _this3.parent.parent.getChildren().indexOf(_this3.parent),
          parent: _this3.parent.parent,
          stageId: _this3.parent.stageId
        };

        _uiEvents.trigger("block:removed", params);

        _uiEvents.trigger(_this3.parent.config.name + ":block:removed", params);
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
     * Return an array of options
     *
     * @returns {Array<OptionInterface>}
     */


    _proto.retrieveOptions = function retrieveOptions() {
      return [new _option.Option(this, "move", "<i class='icon-admin-pagebuilder-handle'></i>", (0, _translate)("Move"), null, ["move-structural"], 10), new _title.TitleOption(this, this.config.label, 20), new _option.Option(this, "edit", "<i class='icon-admin-pagebuilder-systems'></i>", (0, _translate)("Edit"), this.onOptionEdit, ["edit-block"], 30), new _option.Option(this, "duplicate", "<i class='icon-pagebuilder-copy'></i>", (0, _translate)("Duplicate"), this.onOptionDuplicate, ["duplicate-structural"], 40), new _option.Option(this, "remove", "<i class='icon-admin-pagebuilder-remove'></i>", (0, _translate)("Remove"), this.onOptionRemove, ["remove-structural"], 50)];
    };
    /**
     * Dispatch content type clone events
     *
     * @param {ContentTypeInterface} originalBlock
     * @param {ContentTypeInterface} duplicateBlock
     * @param {number} index
     */


    _proto.dispatchContentTypeCloneEvents = function dispatchContentTypeCloneEvents(originalBlock, duplicateBlock, index) {
      var duplicateEventParams = {
        original: originalBlock,
        duplicateBlock: duplicateBlock,
        index: index
      };

      _uiEvents.trigger("block:duplicate", duplicateEventParams);

      _uiEvents.trigger(originalBlock.config.name + ":block:duplicate", duplicateEventParams);
    };
    /**
     * Bind events
     */


    _proto.bindEvents = function bindEvents() {
      var _this4 = this;

      _uiEvents.on("block:sortStart", this.onSortStart.bind(this.parent));

      this.parent.store.subscribe(function (data) {
        _this4.updateObservables();
      }, this.parent.id);
    };
    /**
     * After observables updated, allows to modify observables
     */


    _proto.afterObservablesUpdated = function afterObservablesUpdated() {
      return;
    };
    /**
     * Setup fields observables within the data class property
     *
     * @deprecated
     */


    _proto.setupDataFields = function setupDataFields() {
      var _this5 = this;

      var styleAttributeMapper = new _styleAttributeMapper();
      var styleAttributeFilter = new _styleAttributeFilter(); // Create an empty observable for all fields

      if (this.config.fields) {
        _underscore.keys(this.config.fields).forEach(function (key) {
          _this5.updateDataValue(key, "");
        });
      } // Subscribe to this blocks data in the store


      this.parent.store.subscribe(function (data) {
        _underscore.forEach(data, function (value, key) {
          _this5.updateDataValue(key, value);
        });
      }, this.parent.id); // Calculate the preview style utilising the style attribute mapper & appearance system

      this.previewStyle = _knockout.computed(function () {
        var data = _underscore.mapObject(_this5.previewData, function (value) {
          if (_knockout.isObservable(value)) {
            return value();
          }

          return value;
        });

        if (typeof data.appearance !== "undefined" && typeof _this5.config.appearances !== "undefined" && typeof _this5.config.appearances[data.appearance] !== "undefined") {
          _underscore.extend(data, _this5.config.appearances[data.appearance]);
        } // Extract data values our of observable functions


        return _this5.afterStyleMapped(styleAttributeMapper.toDom(styleAttributeFilter.filter(data)));
      });
      Object.keys(styleAttributeFilter.getAllowedAttributes()).forEach(function (key) {
        if (_knockout.isObservable(_this5.previewData[key])) {
          _this5.previewData[key].subscribe(function () {
            _this5.previewStyle.notifySubscribers();
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
      var _this6 = this;

      var data = this.parent.store.get(this.parent.id);
      var hasDataChanges = false;

      _underscore.each(this.parent.config.fields, function (field, key) {
        if (_this6.fieldsToIgnoreOnRemove && _this6.fieldsToIgnoreOnRemove.includes(key)) {
          return;
        }

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
    /**
     * Update observables
     */


    _proto.updateObservables = function updateObservables() {
      this.observableUpdater.update(this, _underscore.extend({}, this.parent.store.get(this.parent.id)));
      this.afterObservablesUpdated();

      _uiEvents.trigger("previewObservables:updated", {
        preview: this
      });
    };
    /**
     * Event called when starting starts on this element
     *
     * @param {Event} event
     * @param {SortParamsInterface} params
     */


    _proto.onSortStart = function onSortStart(event, params) {
      if (params.block.id === this.parent.id) {
        var originalEle = (0, _jquery)(params.originalEle);
        originalEle.show();
        originalEle.addClass("pagebuilder-sorting-original"); // Reset the width & height of the helper

        (0, _jquery)(params.helper).css({
          width: "",
          height: ""
        }).html((0, _jquery)("<h3 />").text(this.title).html());
      }
    };

    _createClass(Preview, [{
      key: "previewTemplate",
      get: function get() {
        var appearance = this.previewData.appearance ? this.previewData.appearance() : undefined;
        return (0, _appearanceConfig)(this.config.name, appearance).preview_template;
      }
    }]);

    return Preview;
  }();

  return Preview;
});
//# sourceMappingURL=preview.js.map
