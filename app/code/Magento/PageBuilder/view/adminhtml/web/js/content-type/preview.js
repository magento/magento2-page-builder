/*eslint-disable */
/* jscs:disable */

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

define(["jquery", "knockout", "mage/translate", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/modal/dismissible-confirm", "underscore", "Magento_PageBuilder/js/binding/live-edit", "Magento_PageBuilder/js/binding/sortable", "Magento_PageBuilder/js/binding/sortable-children", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type-collection", "Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/content-type-menu", "Magento_PageBuilder/js/content-type-menu/edit", "Magento_PageBuilder/js/content-type-menu/option", "Magento_PageBuilder/js/content-type-menu/title-option", "Magento_PageBuilder/js/drag-drop/registry", "Magento_PageBuilder/js/drag-drop/sortable", "Magento_PageBuilder/js/utils/check-stage-full-screen", "Magento_PageBuilder/js/utils/object", "Magento_PageBuilder/js/content-type/appearance-config"], function (_jquery, _knockout, _translate, _events, _dismissibleConfirm, _underscore, _liveEdit, _sortable, _sortableChildren, _config, _contentTypeCollection, _contentTypeFactory, _contentTypeMenu, _edit, _option, _titleOption, _registry, _sortable2, _checkStageFullScreen, _object, _appearanceConfig) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Preview = /*#__PURE__*/function () {
    "use strict";

    /**
     * Provide preview data as an object which can be queried
     *
     * @deprecated please use getOptionValue directly
     */

    /**
     * Fields that should not be considered when evaluating whether an object has been configured.
     *
     * @see {Preview.isConfigured}
     * @type {[string]}
     */

    /**
     * @param {ContentTypeInterface} contentType
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    function Preview(contentType, config, observableUpdater) {
      this.data = {};
      this.displayLabel = _knockout.observable();
      this.display = _knockout.observable(true);
      this.appearance = _knockout.observable();
      this.isPlaceholderVisible = _knockout.observable(true);
      this.isEmpty = _knockout.observable(true);
      this.viewport = _knockout.observable("");
      this.previewData = {};
      this.fieldsToIgnoreOnRemove = [];
      this.events = {};
      this.isSnapshot = _knockout.observable(false);
      this.mouseover = false;
      this.contentType = contentType;
      this.config = config;
      this.edit = new _edit(this.contentType, this.contentType.dataStore);
      this.optionsMenu = new _contentTypeMenu(this, this.retrieveOptions());
      this.observableUpdater = observableUpdater;
      this.displayLabel(this.config.label);
      this.placeholderCss = _knockout.observable({
        "visible": this.isEmpty,
        "empty-placeholder-background": this.isPlaceholderVisible
      });

      if (_config.getConfig("pagebuilder_content_snapshot")) {
        this.isSnapshot(!(0, _checkStageFullScreen)(this.contentType.stageId));
      }

      this.viewport(_config.getConfig("viewport"));
      this.bindEvents();
      this.populatePreviewData();
    }
    /**
     * Retrieve the preview template
     *
     * @returns {string}
     */


    var _proto = Preview.prototype;

    /**
     * Calls methods by event name.
     *
     * @param {string}  eventName
     * @param {any} params
     */
    _proto.trigger = function trigger(eventName, params) {
      var _this = this;

      if (this.events[eventName]) {
        var methods = this.events[eventName];

        _underscore.each(methods.split(" "), function (methodName) {
          var method = _this[methodName];

          if (method) {
            method.call(_this, params);
          }
        }, this);
      }
    }
    /**
     * Tries to call specified method of a current content type.
     *
     * @param args
     */
    ;

    _proto.delegate = function delegate() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var methodName = args.slice(0, 1)[0];
      var method = this[methodName];

      if (method) {
        method.apply(this, args.slice(1, args.length));
      }
    }
    /**
     * Open the edit form for this content type
     */
    ;

    _proto.openEdit = function openEdit() {
      return this.edit.open();
    }
    /**
     * Update data store
     *
     * @param {string} key
     * @param {string} value
     */
    ;

    _proto.updateData = function updateData(key, value) {
      this.contentType.dataStore.set(key, value);
    }
    /**
     * Retrieve the value for an option
     *
     * @param key
     */
    ;

    _proto.getOptionValue = function getOptionValue(key) {
      return this.contentType.dataStore.get(key);
    }
    /**
     * Set state based on mouseover event for the preview
     *
     * @param {Preview} context
     * @param {Event} event
     */
    ;

    _proto.onMouseOver = function onMouseOver(context, event) {
      if (this.mouseover || (0, _registry.getDraggedContentTypeConfig)()) {
        return;
      } // Ensure no other options panel is displayed


      (0, _jquery)(".pagebuilder-options-visible").removeClass("pagebuilder-options-visible");
      this.mouseover = true;
      this.mouseoverContext = context;
      var currentTarget = event.currentTarget;
      var optionsMenu = (0, _jquery)(currentTarget).find(".pagebuilder-options-wrapper");

      if (!(0, _jquery)(currentTarget).hasClass("type-nested")) {
        optionsMenu = optionsMenu.first();
      }

      var middleOfPreview = currentTarget.getBoundingClientRect().left + currentTarget.offsetWidth / 2; // Check for space for option menu

      if (window.innerWidth - middleOfPreview > optionsMenu.width() / 2) {
        optionsMenu.parent().addClass("pagebuilder-options-middle");
      } else {
        optionsMenu.parent().removeClass("pagebuilder-options-middle");
      }

      optionsMenu.parent().addClass("pagebuilder-options-visible");
      (0, _jquery)(currentTarget).addClass("pagebuilder-content-type-active");
    }
    /**
     * Set state based on mouseout event for the preview
     *
     * @param {Preview} context
     * @param {Event} event
     */
    ;

    _proto.onMouseOut = function onMouseOut(context, event) {
      var _this2 = this;

      this.mouseover = false;

      if ((0, _registry.getDraggedContentTypeConfig)()) {
        return;
      }

      _underscore.delay(function () {
        if (!_this2.mouseover && _this2.mouseoverContext === context) {
          var currentTarget = event.currentTarget;
          var optionsMenu = (0, _jquery)(currentTarget).find(".pagebuilder-options-wrapper");

          if (!(0, _jquery)(currentTarget).hasClass("type-nested")) {
            optionsMenu = optionsMenu.first();
          }

          optionsMenu.parent().removeClass("pagebuilder-options-visible");
          (0, _jquery)(currentTarget).removeClass("pagebuilder-content-type-active");
        }
      }, 100); // 100 ms delay to allow for users hovering over other elements

    }
    /**
     * After children render fire an event
     *
     * @param {Element} element
     * @deprecated
     */
    ;

    _proto.afterChildrenRender = function afterChildrenRender(element) {
      _events.trigger("contentType:childrenRenderAfter", {
        id: this.contentType.id,
        contentType: this.contentType,
        element: element
      });

      _events.trigger(this.contentType.config.name + ":childrenRenderAfter", {
        contentType: this.contentType,
        element: element,
        id: this.contentType.id
      });
    }
    /**
     * Dispatch an after render event for individual content types
     *
     * @param {Element[]} elements
     */
    ;

    _proto.dispatchAfterRenderEvent = function dispatchAfterRenderEvent(elements) {
      var elementNodes = elements.filter(function (renderedElement) {
        return renderedElement.nodeType === Node.ELEMENT_NODE;
      });

      if (elementNodes.length > 0) {
        var element = elementNodes[0];
        this.wrapperElement = element;

        _events.trigger("contentType:renderAfter", {
          id: this.contentType.id,
          contentType: this.contentType,
          element: element
        });

        _events.trigger(this.contentType.config.name + ":renderAfter", {
          contentType: this.contentType,
          element: element,
          id: this.contentType.id
        });

        this.disableImageUploadOnHide(element);
      }
    }
    /**
     * Get the options instance
     *
     * @returns {ContentTypeMenu}
     */
    ;

    _proto.getOptions = function getOptions() {
      return this.optionsMenu;
    }
    /**
     * Handle user editing an instance
     */
    ;

    _proto.onOptionEdit = function onOptionEdit() {
      this.openEdit();
    }
    /**
     * Reverse the display data currently in the data store
     */
    ;

    _proto.onOptionVisibilityToggle = function onOptionVisibilityToggle() {
      var display = this.contentType.dataStore.get("display");
      this.contentType.dataStore.set("display", !display);
      this.dispatchContentTypeVisibilityEvents(this.contentType, !display);
    }
    /**
     * Handle duplicate of items
     */
    ;

    _proto.onOptionDuplicate = function onOptionDuplicate() {
      this.clone(this.contentType, true, true);
    }
    /**
     * Duplicate content type
     *
     * @param {ContentTypeInterface | ContentTypeCollectionInterface} contentType
     * @param {boolean} autoAppend
     * @param {boolean} direct
     * @returns {Promise<ContentTypeInterface> | void}
     */
    ;

    _proto.clone = function clone(contentType, autoAppend, direct) {
      var _this3 = this;

      if (autoAppend === void 0) {
        autoAppend = true;
      }

      if (direct === void 0) {
        direct = false;
      }

      var defaultViewport = _config.getConfig("defaultViewport");

      var contentTypeData = contentType.dataStores[defaultViewport].getState();
      var index = contentType.parentContentType.getChildren()().indexOf(contentType) + 1 || null;
      return (0, _contentTypeFactory)(contentType.config, contentType.parentContentType, contentType.stageId, contentTypeData, 0, contentType.getDataStoresStates()).then(function (duplicateContentType) {
        if (autoAppend) {
          contentType.parentContentType.addChild(duplicateContentType, index);
        }

        _this3.dispatchContentTypeCloneEvents(contentType, duplicateContentType, index, direct);

        return duplicateContentType;
      });
    }
    /**
     * Handle content type removal
     */
    ;

    _proto.onOptionRemove = function onOptionRemove() {
      var _this4 = this;

      var removeContentType = function removeContentType() {
        if (_this4.wrapperElement) {
          // Fade out the content type
          (0, _jquery)(_this4.wrapperElement).fadeOut(350 / 2, function () {
            _this4.contentType.destroy();
          });
        } else {
          _this4.contentType.destroy();
        }
      };

      if (this.isConfigured()) {
        (0, _dismissibleConfirm)({
          actions: {
            confirm: function confirm() {
              // Call the parent to remove the child element
              removeContentType();
            }
          },
          content: (0, _translate)("Are you sure you want to remove this item? The data within this item is not recoverable once removed."),
          // tslint:disable-line:max-line-length
          dismissKey: "pagebuilder_modal_dismissed",
          dismissible: true,
          title: (0, _translate)("Confirm Item Removal")
        });
      } else {
        removeContentType();
      }
    }
    /**
     * Determine if the container can receive drop events? With the current matrix system everything can unless
     * specified in an inherited preview instance.
     *
     * @returns {boolean}
     */
    ;

    _proto.isContainer = function isContainer() {
      return true;
    }
    /**
     * Return the sortable options
     *
     * @returns {JQueryUI.SortableOptions}
     */
    ;

    _proto.getSortableOptions = function getSortableOptions() {
      return (0, _sortable2.getSortableOptions)(this);
    }
    /**
     * Destroys current instance
     */
    ;

    _proto.destroy = function destroy() {
      return;
    }
    /**
     * Get the CSS classes for the children element, as we dynamically create this class name it can't sit in the DOM
     * without causing browser issues
     *
     * @returns {{[p: string]: boolean}}
     */
    ;

    _proto.getChildrenCss = function getChildrenCss() {
      var _ref;

      return _ref = {}, _ref[this.config.name + "-container"] = true, _ref;
    }
    /**
     * Return an array of options
     *
     * @returns {OptionsInterface}
     */
    ;

    _proto.retrieveOptions = function retrieveOptions() {
      var options = {
        move: new _option({
          preview: this,
          icon: "<i class='icon-admin-pagebuilder-handle'></i>",
          title: (0, _translate)("Move"),
          classes: ["move-structural"],
          sort: 10
        }),
        title: new _titleOption({
          preview: this,
          title: this.config.label,
          template: "Magento_PageBuilder/content-type/title",
          sort: 20
        }),
        edit: new _option({
          preview: this,
          icon: "<i class='icon-admin-pagebuilder-systems'></i>",
          title: (0, _translate)("Edit"),
          action: this.onOptionEdit,
          classes: ["edit-content-type"],
          sort: 30
        }),
        duplicate: new _option({
          preview: this,
          icon: "<i class='icon-pagebuilder-copy'></i>",
          title: (0, _translate)("Duplicate"),
          action: this.onOptionDuplicate,
          classes: ["duplicate-structural"],
          sort: 50
        }),
        remove: new _option({
          preview: this,
          icon: "<i class='icon-admin-pagebuilder-remove'></i>",
          title: (0, _translate)("Remove"),
          action: this.onOptionRemove,
          classes: ["remove-structural"],
          sort: 60
        })
      };
      return options;
    }
    /**
     * Dispatch content type clone events
     *
     * @param {ContentTypeInterface | ContentTypeCollectionInterface} originalContentType
     * @param {ContentTypeInterface | ContentTypeCollectionInterface} duplicateContentType
     * @param {number} index
     * @param {boolean} direct
     */
    ;

    _proto.dispatchContentTypeCloneEvents = function dispatchContentTypeCloneEvents(originalContentType, duplicateContentType, index, direct) {
      var duplicateEventParams = {
        originalContentType: originalContentType,
        duplicateContentType: duplicateContentType,
        index: index,
        direct: direct
      };

      _events.trigger("contentType:duplicateAfter", duplicateEventParams);

      _events.trigger(originalContentType.config.name + ":duplicateAfter", duplicateEventParams);
    }
    /**
     * Dispatch content type visibility events
     *
     * @param {ContentTypeInterface | ContentTypeCollectionInterface} contentType
     * @param {boolean} visibility
     */
    ;

    _proto.dispatchContentTypeVisibilityEvents = function dispatchContentTypeVisibilityEvents(contentType, visibility) {
      var visibilityEventParams = {
        contentType: contentType,
        visibility: visibility
      };

      _events.trigger("contentType:visibilityAfter", visibilityEventParams);

      _events.trigger(contentType.config.name + ":visibilityAfter", visibilityEventParams);
    }
    /**
     * Bind events
     */
    ;

    _proto.bindEvents = function bindEvents() {
      var _this5 = this;

      var fullScreenModeChangeAfterEvent = "stage:" + this.contentType.stageId + ":fullScreenModeChangeAfter";
      this.contentType.dataStore.subscribe(function (data) {
        _this5.updateObservables();

        _this5.updatePlaceholderVisibility(data); // Keep a reference to the display state in an observable for adding classes to the wrapper


        _this5.display(!!data.display);

        _this5.appearance(data.appearance);
      });

      if (this.contentType instanceof _contentTypeCollection) {
        this.contentType.children.subscribe(function (children) {
          _this5.isEmpty(!children.length);
        });
      }

      _events.on(fullScreenModeChangeAfterEvent, this.toggleSnapshot.bind(this));

      _events.on("stage:" + this.contentType.stageId + ":viewportChangeAfter", function (args) {
        _this5.viewport(args.viewport);
      });
    }
    /**
     * After observables updated, allows to modify observables
     */
    ;

    _proto.afterObservablesUpdated = function afterObservablesUpdated() {
      return;
    }
    /**
     * Does the current instance have any children or values different from the default for it's type?
     *
     * @returns {boolean}
     */
    ;

    _proto.isConfigured = function isConfigured() {
      var _this6 = this;

      var data = this.contentType.dataStore.getState();
      var fields = this.contentType.config.fields[this.appearance() + "-appearance"] || this.contentType.config.fields.default;
      var hasDataChanges = false;

      _underscore.each(fields, function (field, key) {
        if (_this6.fieldsToIgnoreOnRemove && _this6.fieldsToIgnoreOnRemove.includes(key)) {
          return;
        }

        var fieldValue = (0, _object.get)(data, key);

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
    }
    /**
     * Any hidden element should block drag / drop events from uploading images from the OS. We have to block this for
     * all elements as underlying elements could still receive the events if a parent is hidden.
     *
     * @param {Element} element
     */
    ;

    _proto.disableImageUploadOnHide = function disableImageUploadOnHide(element) {
      var _this7 = this;

      (0, _jquery)(element).on("drag dragstart dragend dragover dragenter dragleave drop", function (event) {
        if (_this7.display() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
      });
    }
    /**
     * Update observables
     */
    ;

    _proto.updateObservables = function updateObservables() {
      this.observableUpdater.update(this, _underscore.extend({}, this.contentType.dataStore.getState()));
      this.afterObservablesUpdated();
    }
    /**
     * Update placeholder background visibility base on height and padding
     *
     * @param {DataObject} data
     */
    ;

    _proto.updatePlaceholderVisibility = function updatePlaceholderVisibility(data) {
      var minHeight = !_underscore.isEmpty(data.min_height) ? parseFloat(data.min_height) : 130;
      var marginsAndPadding = _underscore.isString(data.margins_and_padding) && data.margins_and_padding ? JSON.parse(data.margins_and_padding) : data.margins_and_padding || {};
      var padding = marginsAndPadding.padding || {};
      var paddingBottom = parseFloat(padding.bottom) || 0;
      var paddingTop = parseFloat(padding.top) || 0;
      this.isPlaceholderVisible(paddingBottom + paddingTop + minHeight >= 130);
    }
    /**
     * Populate the preview data with calls to the supported getOptionValue method
     *
     * @deprecated this function is only included to preserve backwards compatibility, use getOptionValue directly
     */
    ;

    _proto.populatePreviewData = function populatePreviewData() {
      var _this8 = this;

      if (this.config.fields) {
        _underscore.each(this.config.fields, function (fields) {
          _underscore.keys(fields).forEach(function (key) {
            _this8.previewData[key] = _knockout.observable("");
          });
        });
      } // Subscribe to this content types data in the store


      this.contentType.dataStore.subscribe(function (data) {
        _underscore.forEach(data, function (value, key) {
          var optionValue = _this8.getOptionValue(key);

          if (_knockout.isObservable(_this8.previewData[key])) {
            _this8.previewData[key](optionValue);
          } else {
            if (_underscore.isArray(optionValue)) {
              _this8.previewData[key] = _knockout.observableArray(optionValue);
            } else {
              _this8.previewData[key] = _knockout.observable(optionValue);
            }
          }
        });
      });
    }
    /**
     * Enable snapshot mode.
     * @param args
     */
    ;

    _proto.toggleSnapshot = function toggleSnapshot(args) {
      if (_config.getConfig("pagebuilder_content_snapshot")) {
        this.isSnapshot(!args.fullScreen);
      }
    };

    _createClass(Preview, [{
      key: "template",
      get: function get() {
        return (0, _appearanceConfig)(this.config.name, this.appearance()).preview_template;
      }
    }]);

    return Preview;
  }();

  return Preview;
});
//# sourceMappingURL=preview.js.map