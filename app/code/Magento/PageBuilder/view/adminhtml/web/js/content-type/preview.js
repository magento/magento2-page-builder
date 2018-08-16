/*eslint-disable */
define(["jquery", "knockout", "mage/translate", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/modal/dismissible-confirm", "underscore", "Magento_PageBuilder/js/binding/live-edit", "Magento_PageBuilder/js/binding/sortable", "Magento_PageBuilder/js/binding/sortable-children", "Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/content-type-menu", "Magento_PageBuilder/js/content-type-menu/edit", "Magento_PageBuilder/js/content-type-menu/hide-show-option", "Magento_PageBuilder/js/content-type-menu/option", "Magento_PageBuilder/js/content-type-menu/title-option", "Magento_PageBuilder/js/drag-drop/container-animation", "Magento_PageBuilder/js/drag-drop/sortable", "Magento_PageBuilder/js/content-type/appearance-config"], function (_jquery, _knockout, _translate, _events, _dismissibleConfirm, _underscore, _liveEdit, _sortable, _sortableChildren, _contentTypeFactory, _contentTypeMenu, _edit, _hideShowOption, _option, _titleOption, _containerAnimation, _sortable2, _appearanceConfig) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @api
   */
  var Preview =
  /*#__PURE__*/
  function () {
    /**
     * @deprecated
     */

    /**
     * Fields that should not be considered when evaluating whether an object has been configured.
     *
     * @see {Preview.isConfigured}
     * @type {[string]}
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
      this.displayLabel = _knockout.observable();
      this.display = _knockout.observable(true);
      this.wrapperElement = void 0;
      this.previewData = {};
      this.fieldsToIgnoreOnRemove = [];
      this.edit = void 0;
      this.optionsMenu = void 0;
      this.observableUpdater = void 0;
      this.mouseover = false;
      this.mouseoverContext = void 0;
      this.parent = parent;
      this.config = config;
      this.edit = new _edit(this.parent, this.parent.dataStore);
      this.optionsMenu = new _contentTypeMenu(this, this.retrieveOptions());
      this.observableUpdater = observableUpdater;
      this.displayLabel(this.config.label);
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
     * Open the edit form for this content type
     */
    _proto.openEdit = function openEdit() {
      return this.edit.open();
    };
    /**
     * Update data store
     *
     * @param {string} key
     * @param {string} value
     */


    _proto.updateData = function updateData(key, value) {
      var data = this.parent.dataStore.get();
      data[key] = value;
      this.parent.dataStore.update(data);
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
      } // Ensure no other options panel is displayed


      (0, _jquery)(".pagebuilder-options-visible").removeClass("pagebuilder-options-visible");
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
      _events.trigger("contentType:childrenRenderAfter", {
        id: this.parent.id,
        contentType: this.parent,
        element: element
      });

      _events.trigger(this.parent.config.name + ":childrenRenderAfter", {
        contentType: this.parent,
        element: element,
        id: this.parent.id
      });
    };
    /**
     * Dispatch an after render event for individual content types
     *
     * @param {Element[]} elements
     */


    _proto.dispatchAfterRenderEvent = function dispatchAfterRenderEvent(elements) {
      var elementNodes = elements.filter(function (renderedElement) {
        return renderedElement.nodeType === Node.ELEMENT_NODE;
      });

      if (elementNodes.length > 0) {
        var element = elementNodes[0];
        this.wrapperElement = element;

        _events.trigger("contentType:renderAfter", {
          id: this.parent.id,
          contentType: this.parent,
          element: element
        });

        _events.trigger(this.parent.config.name + ":renderAfter", {
          contentType: this.parent,
          element: element,
          id: this.parent.id
        });

        this.disableImageUploadOnHide(element);
      }
    };
    /**
     * Get the options instance
     *
     * @returns {ContentTypeMenu}
     */


    _proto.getOptions = function getOptions() {
      return this.optionsMenu;
    };
    /**
     * Handle user editing an instance
     */


    _proto.onOptionEdit = function onOptionEdit() {
      this.openEdit();
    };
    /**
     * Reverse the display data currently in the data store
     */


    _proto.onOptionVisibilityToggle = function onOptionVisibilityToggle() {
      var display = this.parent.dataStore.get("display");
      this.parent.dataStore.update(!display, "display");
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
     * @param {ContentTypeInterface & ContentTypeCollectionInterface} contentType
     * @param {boolean} autoAppend
     * @returns {Promise<ContentTypeInterface> | void}
     */


    _proto.clone = function clone(contentType, autoAppend) {
      var _this2 = this;

      if (autoAppend === void 0) {
        autoAppend = true;
      }

      var contentTypeData = contentType.dataStore.get();
      var index = contentType.parent.getChildren()().indexOf(contentType) + 1 || null;
      return new Promise(function (resolve) {
        (0, _contentTypeFactory)(contentType.config, contentType.parent, contentType.stageId, contentTypeData).then(function (duplicateContentType) {
          if (autoAppend) {
            contentType.parent.addChild(duplicateContentType, index);
          }

          _this2.dispatchContentTypeCloneEvents(contentType, duplicateContentType, index);

          resolve(duplicateContentType);
        });
      });
    };
    /**
     * Handle content type removal
     */


    _proto.onOptionRemove = function onOptionRemove() {
      var _this3 = this;

      var removeContentType = function removeContentType() {
        var dispatchRemoveEvent = function dispatchRemoveEvent() {
          var params = {
            contentType: _this3.parent,
            index: _this3.parent.parent.getChildren().indexOf(_this3.parent),
            parent: _this3.parent.parent,
            stageId: _this3.parent.stageId
          };

          _events.trigger("contentType:removeAfter", params);

          _events.trigger(_this3.parent.config.name + ":removeAfter", params);
        };

        if (_this3.wrapperElement) {
          var parentContainerElement = (0, _jquery)(_this3.wrapperElement).parents(".type-container");
          var containerLocked = _this3.parent.parent.getChildren()().length === 1 && (0, _containerAnimation.lockContainerHeight)(parentContainerElement); // Fade out the content type

          (0, _jquery)(_this3.wrapperElement).fadeOut(_containerAnimation.animationTime / 2, function () {
            dispatchRemoveEvent(); // Prepare the event handler to animate the container height on render

            (0, _containerAnimation.animateContainerHeight)(containerLocked, parentContainerElement);
          });
        } else {
          dispatchRemoveEvent();
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
    };
    /**
     * Determine if the container can receive drop events? With the current matrix system everything can unless
     * specified in an inherited preview instance.
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
     * Get the CSS classes for the children element, as we dynamically create this class name it can't sit in the DOM
     * without causing browser issues
     *
     * @returns {{[p: string]: boolean}}
     */


    _proto.getChildrenCss = function getChildrenCss() {
      var _ref;

      return _ref = {}, _ref[this.config.name + "-container"] = true, _ref;
    };
    /**
     * Return an array of options
     *
     * @returns {OptionsInterface}
     */


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
      }; // If the content type is is_hideable show the hide / show option

      if (this.parent.config.is_hideable) {
        options.hideShow = new _hideShowOption({
          preview: this,
          icon: _hideShowOption.showIcon,
          title: _hideShowOption.showText,
          action: this.onOptionVisibilityToggle,
          classes: ["hide-show-content-type"],
          sort: 40
        });
      }

      return options;
    };
    /**
     * Dispatch content type clone events
     *
     * @param {ContentTypeInterface} originalContentType
     * @param {ContentTypeInterface} duplicateContentType
     * @param {number} index
     */


    _proto.dispatchContentTypeCloneEvents = function dispatchContentTypeCloneEvents(originalContentType, duplicateContentType, index) {
      var duplicateEventParams = {
        original: originalContentType,
        duplicateContentType: duplicateContentType,
        index: index
      };

      _events.trigger("contentType:duplicateAfter", duplicateEventParams);

      _events.trigger(originalContentType.config.name + ":duplicateAfter", duplicateEventParams);
    };
    /**
     * Bind events
     */


    _proto.bindEvents = function bindEvents() {
      var _this4 = this;

      this.parent.dataStore.subscribe(function (data) {
        _this4.updateObservables(); // Keep a reference to the display state in an observable for adding classes to the wrapper


        _this4.display(!!data.display);
      });
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

      // Create an empty observable for all fields
      if (this.config.fields) {
        _underscore.keys(this.config.fields).forEach(function (key) {
          _this5.updateDataValue(key, "");
        });
      } // Subscribe to this content types data in the store


      this.parent.dataStore.subscribe(function (data) {
        _underscore.forEach(data, function (value, key) {
          _this5.updateDataValue(key, value);
        });
      });
    };
    /**
     * Does the current instance have any children or values different from the default for it's type?
     *
     * @returns {boolean}
     */


    _proto.isConfigured = function isConfigured() {
      var _this6 = this;

      var data = this.parent.dataStore.get();
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
     * Any hidden element should block drag / drop events from uploading images from the OS. We have to block this for
     * all elements as underlying elements could still receive the events if a parent is hidden.
     *
     * @param {Element} element
     */


    _proto.disableImageUploadOnHide = function disableImageUploadOnHide(element) {
      var _this7 = this;

      (0, _jquery)(element).on("drag dragstart dragend dragover dragenter dragleave drop", function (event) {
        if (_this7.display() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
      });
    };
    /**
     * Update observables
     */


    _proto.updateObservables = function updateObservables() {
      this.observableUpdater.update(this, _underscore.extend({}, this.parent.dataStore.get()));
      this.afterObservablesUpdated();

      _events.trigger("previewData:updateAfter", {
        preview: this
      });
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
