/*eslint-disable */
/* jscs:disable */

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

define(["jquery", "knockout", "mage/translate", "Magento_PageBuilder/js/events", "Magento_Ui/js/modal/alert", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/content-type-menu/option", "Magento_PageBuilder/js/content-type/column-group/grid-size", "Magento_PageBuilder/js/content-type/column-group/preview", "Magento_PageBuilder/js/content-type/preview-collection", "Magento_PageBuilder/js/content-type/column/resize"], function (_jquery, _knockout, _translate, _events, _alert, _config, _contentTypeFactory, _option, _gridSize, _preview, _previewCollection, _resize) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Preview =
  /*#__PURE__*/
  function (_previewCollection2) {
    "use strict";

    _inheritsLoose(Preview, _previewCollection2);

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
      var _this;

      _this = _previewCollection2.call(this, contentType, config, observableUpdater) || this; // Update the width label for the column

      _this.resizing = _knockout.observable(false);
      _this.fieldsToIgnoreOnRemove = ["width"];

      _this.contentType.dataStore.subscribe(_this.updateColumnWidthClass.bind(_assertThisInitialized(_this)), "width");

      _this.contentType.dataStore.subscribe(_this.updateDisplayLabel.bind(_assertThisInitialized(_this)), "width");

      _this.contentType.dataStore.subscribe(_this.triggerChildren.bind(_assertThisInitialized(_this)), "width");

      _this.contentType.parentContentType.dataStore.subscribe(_this.updateDisplayLabel.bind(_assertThisInitialized(_this)), "grid_size"); // Update the column number for the column


      _this.contentType.parentContentType.children.subscribe(_this.updateDisplayLabel.bind(_assertThisInitialized(_this)));

      return _this;
    }
    /**
     * Get background image url base on the viewport.
     *
     * @returns {string}
     */


    var _proto = Preview.prototype;

    _proto.getBackgroundImage = function getBackgroundImage() {
      var mobileImage = this.contentType.dataStore.get("mobile_image");
      var desktopImage = this.contentType.dataStore.get("background_image");
      var backgroundImage = this.viewport() === "mobile" && mobileImage.length ? mobileImage : desktopImage;
      return backgroundImage.length ? "url(\"" + backgroundImage[0].url + "\")" : "none";
    }
    /**
     * Bind events
     */
    ;

    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _previewCollection2.prototype.bindEvents.call(this);

      _events.on("column:moveAfter", function (args) {
        if (args.contentType.id === _this2.contentType.id) {
          _this2.updateDisplayLabel();
        }
      });

      if (_config.getContentTypeConfig("column-group")) {
        _events.on("column:dropAfter", function (args) {
          if (args.id === _this2.contentType.id) {
            _this2.createColumnGroup();
          }
        });
      }
    }
    /**
     * Make a reference to the element in the column
     *
     * @param element
     */
    ;

    _proto.initColumn = function initColumn(element) {
      this.element = (0, _jquery)(element);
      this.updateColumnWidthClass();

      _events.trigger("column:initializeAfter", {
        column: this.contentType,
        element: (0, _jquery)(element),
        columnGroup: this.contentType.parentContentType
      });

      this.updateDisplayLabel();
    }
    /**
     * Return an array of options
     *
     * @returns {OptionsInterface}
     */
    ;

    _proto.retrieveOptions = function retrieveOptions() {
      var options = _previewCollection2.prototype.retrieveOptions.call(this);

      options.move = new _option({
        preview: this,
        icon: "<i class='icon-admin-pagebuilder-handle'></i>",
        title: (0, _translate)("Move"),
        classes: ["move-column"],
        sort: 10
      });
      return options;
    }
    /**
     * Init the resize handle for the resizing functionality
     *
     * @param handle
     */
    ;

    _proto.bindResizeHandle = function bindResizeHandle(handle) {
      _events.trigger("column:resizeHandleBindAfter", {
        column: this.contentType,
        handle: (0, _jquery)(handle),
        columnGroup: this.contentType.parentContentType
      });
    }
    /**
     * Wrap the current column in a group if it not in a column-group
     *
     * @returns {Promise<ContentTypeCollectionInterface>}
     */
    ;

    _proto.createColumnGroup = function createColumnGroup() {
      var _this3 = this;

      if (this.contentType.parentContentType.config.name !== "column-group") {
        var index = this.contentType.parentContentType.children().indexOf(this.contentType); // Remove child instantly to stop content jumping around

        this.contentType.parentContentType.removeChild(this.contentType); // Create a new instance of column group to wrap our columns with

        var defaultGridSize = (0, _gridSize.getDefaultGridSize)();
        return (0, _contentTypeFactory)(_config.getContentTypeConfig("column-group"), this.contentType.parentContentType, this.contentType.stageId, {
          grid_size: defaultGridSize
        }).then(function (columnGroup) {
          var col1Width = (Math.ceil(defaultGridSize / 2) * 100 / defaultGridSize).toFixed(Math.round(100 / defaultGridSize) !== 100 / defaultGridSize ? 8 : 0);
          return Promise.all([(0, _contentTypeFactory)(_this3.contentType.config, columnGroup, columnGroup.stageId, {
            width: col1Width + "%"
          }), (0, _contentTypeFactory)(_this3.contentType.config, columnGroup, columnGroup.stageId, {
            width: 100 - parseFloat(col1Width) + "%"
          })]).then(function (columns) {
            columnGroup.addChild(columns[0], 0);
            columnGroup.addChild(columns[1], 1);

            _this3.contentType.parentContentType.addChild(columnGroup, index);

            _this3.fireMountEvent(columnGroup, columns[0], columns[1]);

            return columnGroup;
          });
        });
      }
    }
    /**
     * Duplicate a child of the current instance
     *
     * @param {ContentTypeCollectionInterface<Preview>} contentType
     * @param {boolean} autoAppend
     * @returns {Promise<ContentTypeCollectionInterface> | void}
     */
    ;

    _proto.clone = function clone(contentType, autoAppend) {
      if (autoAppend === void 0) {
        autoAppend = true;
      }

      var resizeUtils = this.contentType.parentContentType.preview.getResizeUtils(); // Are we duplicating from a container content type?

      if (contentType.config.name !== "column" || this.contentType.parentContentType.children().length === 0 || this.contentType.parentContentType.children().length > 0 && resizeUtils.getColumnsWidth() < 100) {
        return _previewCollection2.prototype.clone.call(this, contentType, autoAppend);
      } // Attempt to split the current column into parts


      var splitTimes = Math.round(resizeUtils.getColumnWidth(contentType) / resizeUtils.getSmallestColumnWidth());

      if (splitTimes > 1) {
        var splitClone = _previewCollection2.prototype.clone.call(this, contentType, autoAppend);

        if (splitClone) {
          splitClone.then(function (duplicateContentType) {
            /**
             * Distribute the width across the original & duplicated columns, if the we have an odd number of
             * split times apply it to the original.
             */
            var originalWidth = (Math.floor(splitTimes / 2) + splitTimes % 2) * resizeUtils.getSmallestColumnWidth();
            var duplicateWidth = Math.floor(splitTimes / 2) * resizeUtils.getSmallestColumnWidth();
            (0, _resize.updateColumnWidth)(contentType, resizeUtils.getAcceptedColumnWidth(originalWidth.toString()));
            (0, _resize.updateColumnWidth)(duplicateContentType, resizeUtils.getAcceptedColumnWidth(duplicateWidth.toString()));
            return duplicateContentType;
          });
        }
      } else {
        // Conduct an outward search on the children to locate a suitable shrinkable column
        var shrinkableColumn = resizeUtils.findShrinkableColumn(contentType);

        if (shrinkableColumn) {
          var shrinkableClone = _previewCollection2.prototype.clone.call(this, contentType, autoAppend);

          if (shrinkableClone) {
            shrinkableClone.then(function (duplicateContentType) {
              (0, _resize.updateColumnWidth)(shrinkableColumn, resizeUtils.getAcceptedColumnWidth((resizeUtils.getColumnWidth(shrinkableColumn) - resizeUtils.getSmallestColumnWidth()).toString()));
              (0, _resize.updateColumnWidth)(duplicateContentType, resizeUtils.getSmallestColumnWidth());
              return duplicateContentType;
            });
          }
        } else {
          // If we aren't able to duplicate inform the user why
          (0, _alert)({
            content: (0, _translate)("There is no free space within the column group to perform this action."),
            title: (0, _translate)("Unable to duplicate column")
          });
        }
      }
    }
    /**
     * Update the display label for the column
     */
    ;

    _proto.updateDisplayLabel = function updateDisplayLabel() {
      if (this.contentType.parentContentType.preview instanceof _preview) {
        var newWidth = parseFloat(this.contentType.dataStore.get("width").toString());
        var gridSize = this.contentType.parentContentType.preview.gridSize();
        var newLabel = Math.round(newWidth / (100 / gridSize)) + "/" + gridSize;
        var columnIndex = this.contentType.parentContentType.children().indexOf(this.contentType);
        var columnNumber = columnIndex !== -1 ? columnIndex + 1 + " " : "";
        this.displayLabel((0, _translate)("Column") + " " + columnNumber + "(" + newLabel + ")");
      }
    }
    /**
     * Syncs the column-width-* class on the children-wrapper with the current width to the nearest tenth rounded up
     */
    ;

    _proto.updateColumnWidthClass = function updateColumnWidthClass() {
      // Only update once instantiated
      if (!this.element) {
        return;
      }

      var currentClass = this.element.attr("class").match(/(?:^|\s)(column-width-\d{1,3})(?:$|\s)/);

      if (currentClass !== null) {
        this.element.removeClass(currentClass[1]);
      }

      var roundedWidth = Math.ceil(parseFloat(this.contentType.dataStore.get("width").toString()) / 10) * 10;
      this.element.addClass("column-width-" + roundedWidth);
    }
    /**
     * Return selected element styles
     *
     * @param element
     * @param styleProperties
     */
    ;

    _proto.getStyle = function getStyle(element, styleProperties) {
      var stylesObject = element.style();
      return styleProperties.reduce(function (obj, key) {
        var _extends2;

        return _extends({}, obj, (_extends2 = {}, _extends2[key] = stylesObject[key], _extends2));
      }, {});
    }
    /**
     * Return element styles without selected
     *
     * @param element
     * @param styleProperties
     */
    ;

    _proto.getStyleWithout = function getStyleWithout(element, styleProperties) {
      var stylesObject = element.style();
      return Object.keys(stylesObject).filter(function (key) {
        return !styleProperties.includes(key);
      }).reduce(function (obj, key) {
        var _extends3;

        return _extends({}, obj, (_extends3 = {}, _extends3[key] = stylesObject[key], _extends3));
      }, {});
    }
    /**
     * Fire the mount event for content types
     *
     * @param {ContentTypeInterface[]} contentTypes
     */
    ;

    _proto.fireMountEvent = function fireMountEvent() {
      for (var _len = arguments.length, contentTypes = new Array(_len), _key = 0; _key < _len; _key++) {
        contentTypes[_key] = arguments[_key];
      }

      contentTypes.forEach(function (contentType) {
        _events.trigger("contentType:mountAfter", {
          id: contentType.id,
          contentType: contentType
        });

        _events.trigger(contentType.config.name + ":mountAfter", {
          id: contentType.id,
          contentType: contentType
        });
      });
    }
    /**
     * Delegate trigger call on children elements.
     */
    ;

    _proto.triggerChildren = function triggerChildren() {
      if (this.contentType.parentContentType.preview instanceof _preview) {
        var newWidth = parseFloat(this.contentType.dataStore.get("width").toString());
        this.delegate("trigger", "columnWidthChangeAfter", {
          width: newWidth
        });
      }
    };

    return Preview;
  }(_previewCollection);

  return Preview;
});
//# sourceMappingURL=preview.js.map