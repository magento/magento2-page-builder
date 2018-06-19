/*eslint-disable */
define(["jquery", "knockout", "mage/translate", "Magento_Ui/js/modal/alert", "uiEvents", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/content-type-menu/option", "Magento_PageBuilder/js/content-type/column-group/resizing", "Magento_PageBuilder/js/content-type/preview-collection"], function (_jquery, _knockout, _translate, _alert, _uiEvents, _config, _contentTypeFactory, _option, _resizing, _previewCollection) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Preview =
  /*#__PURE__*/
  function (_PreviewCollection) {
    _inheritsLoose(Preview, _PreviewCollection);

    /**
     * @param {ContentTypeInterface} parent
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    function Preview(parent, config, observableUpdater) {
      var _this;

      _this = _PreviewCollection.call(this, parent, config, observableUpdater) || this;
      _this.resizing = _knockout.observable(false);
      _this.element = void 0;
      _this.columnGroupUtils = void 0;
      _this.columnGroupUtils = new _resizing(_this.parent.parent);

      _this.previewData.width.subscribe(function (newWidth) {
        var gridSize = _this.columnGroupUtils.getGridSize();

        newWidth = parseFloat(newWidth);
        newWidth = Math.round(newWidth / (100 / gridSize));
        var newLabel = newWidth + "/" + gridSize;
        var column = (0, _translate)("Column");

        _this.displayLabel(column + " " + newLabel);
      });

      return _this;
    }
    /**
     * Bind events
     */


    var _proto = Preview.prototype;

    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _PreviewCollection.prototype.bindEvents.call(this);

      if (_config.getContentTypeConfig("column-group")) {
        _uiEvents.on("column:contentType:mount", function (args) {
          if (args.id === _this2.parent.id) {
            _this2.createColumnGroup();
          }
        });
      }
    };
    /**
     * Make a reference to the element in the column
     *
     * @param element
     */


    _proto.initColumn = function initColumn(element) {
      this.element = (0, _jquery)(element);

      _uiEvents.trigger("column:initElement", {
        column: this.parent,
        element: (0, _jquery)(element),
        parent: this.parent.parent
      });
    };
    /**
     * Return an array of options
     *
     * @returns {Array<OptionInterface>}
     */


    _proto.retrieveOptions = function retrieveOptions() {
      var options = _PreviewCollection.prototype.retrieveOptions.call(this);

      var newOptions = options.filter(function (option) {
        return option.code !== "move";
      });
      newOptions.unshift(new _option(this, "move", "<i class='icon-admin-pagebuilder-handle'></i>", (0, _translate)("Move"), null, ["move-column"], 10));
      return newOptions;
    };
    /**
     * Init the resize handle for the resizing functionality
     *
     * @param handle
     */


    _proto.bindResizeHandle = function bindResizeHandle(handle) {
      _uiEvents.trigger("column:bindResizeHandle", {
        column: this.parent,
        handle: (0, _jquery)(handle),
        parent: this.parent.parent
      });
    };
    /**
     * Wrap the current column in a group if it not in a column-group
     *
     * @returns {Promise<ContentTypeInterface>}
     */


    _proto.createColumnGroup = function createColumnGroup() {
      var _this3 = this;

      if (this.parent.parent.config.name !== "column-group") {
        var index = this.parent.parent.children().indexOf(this.parent); // Remove child instantly to stop content jumping around

        this.parent.parent.removeChild(this.parent); // Get default grid size from config

        var stageConfig = _config.getConfig("stage_config");

        this.parent.parent.gridSize = stageConfig.column_grid_size; // Create a new instance of column group to wrap our columns with

        return (0, _contentTypeFactory)(_config.getContentTypeConfig("column-group"), this.parent.parent, this.parent.stageId, {
          gridSize: stageConfig.column_grid_size
        }).then(function (columnGroup) {
          return Promise.all([(0, _contentTypeFactory)(_this3.parent.config, columnGroup, columnGroup.stageId, {
            width: "50%"
          }), (0, _contentTypeFactory)(_this3.parent.config, columnGroup, columnGroup.stageId, {
            width: "50%"
          })]).then(function (columns) {
            columnGroup.addChild(columns[0], 0);
            columnGroup.addChild(columns[1], 1);

            _this3.parent.parent.addChild(columnGroup, index);

            _this3.fireMountEvent(columnGroup, columns[0], columns[1]);

            return columnGroup;
          });
        });
      }
    };
    /**
     * Duplicate a child of the current instance
     *
     * @param {ContentTypeInterface} contentType
     * @param {boolean} autoAppend
     * @returns {Promise<ContentTypeInterface> | void}
     */


    _proto.clone = function clone(contentType, autoAppend) {
      var _this4 = this;

      if (autoAppend === void 0) {
        autoAppend = true;
      }

      // Are we duplicating from a parent?
      if (contentType.config.name !== "column" || this.parent.parent.children().length === 0 || this.parent.parent.children().length > 0 && this.columnGroupUtils.getColumnsWidth() < 100) {
        return _PreviewCollection.prototype.clone.call(this, contentType, autoAppend);
      } // Attempt to split the current column into parts


      var splitTimes = Math.round(this.columnGroupUtils.getColumnWidth(contentType) / this.columnGroupUtils.getSmallestColumnWidth());

      if (splitTimes > 1) {
        var splitClone = _PreviewCollection.prototype.clone.call(this, contentType, autoAppend);

        if (splitClone) {
          splitClone.then(function (duplicateContentType) {
            var originalWidth = 0;
            var duplicateWidth = 0;

            for (var i = 0; i <= splitTimes; i++) {
              if (splitTimes > 0) {
                originalWidth += _this4.columnGroupUtils.getSmallestColumnWidth();
                --splitTimes;
              }

              if (splitTimes > 0) {
                duplicateWidth += _this4.columnGroupUtils.getSmallestColumnWidth();
                --splitTimes;
              }
            }

            _this4.columnGroupUtils.updateColumnWidth(contentType, _this4.columnGroupUtils.getAcceptedColumnWidth(originalWidth.toString()));

            _this4.columnGroupUtils.updateColumnWidth(duplicateContentType, _this4.columnGroupUtils.getAcceptedColumnWidth(duplicateWidth.toString()));

            return duplicateContentType;
          });
        }
      } else {
        // Conduct an outward search on the children to locate a suitable shrinkable column
        var shrinkableColumn = this.columnGroupUtils.findShrinkableColumn(contentType);

        if (shrinkableColumn) {
          var shrinkableClone = _PreviewCollection.prototype.clone.call(this, contentType, autoAppend);

          if (shrinkableClone) {
            shrinkableClone.then(function (duplicateContentType) {
              _this4.columnGroupUtils.updateColumnWidth(shrinkableColumn, _this4.columnGroupUtils.getAcceptedColumnWidth((_this4.columnGroupUtils.getColumnWidth(shrinkableColumn) - _this4.columnGroupUtils.getSmallestColumnWidth()).toString()));

              _this4.columnGroupUtils.updateColumnWidth(duplicateContentType, _this4.columnGroupUtils.getSmallestColumnWidth());

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
    };
    /**
     * Update the style attribute mapper converts images to directives, override it to include the correct URL
     *
     * @returns styles
     */


    _proto.afterStyleMapped = function afterStyleMapped(styles) {
      // Extract data values our of observable functions
      // The style attribute mapper converts images to directives, override it to include the correct URL
      if (this.previewData.background_image && _typeof(this.previewData.background_image()[0]) === "object") {
        styles.backgroundImage = "url(" + this.previewData.background_image()[0].url + ")";
      } // If we have left and right margins we need to minus this from the total width


      if (this.previewData.margins_and_padding && this.previewData.margins_and_padding().margin) {
        var margins = this.previewData.margins_and_padding().margin;
        var horizontalMargin = parseInt(margins.left || 0, 10) + parseInt(margins.right || 0, 10);
        styles.width = "calc(" + styles.width + " - " + horizontalMargin + "px)";
      } // If the right margin is 0, we set it to 1px to overlap the columns to create a single border


      if (styles.marginRight === "0px") {
        styles.marginRight = "1px";
      } // If the border is set to default we show no border in the admin preview, as we're unaware of the themes styles


      if (this.previewData.border && this.previewData.border() === "_default") {
        styles.border = "none";
      }

      return styles;
    };
    /**
     * Fire the mount event for content types
     *
     * @param {ContentTypeInterface[]} contentTypes
     */


    _proto.fireMountEvent = function fireMountEvent() {
      for (var _len = arguments.length, contentTypes = new Array(_len), _key = 0; _key < _len; _key++) {
        contentTypes[_key] = arguments[_key];
      }

      contentTypes.forEach(function (contentType) {
        _uiEvents.trigger("contentType:mount", {
          id: contentType.id,
          contentType: contentType
        });

        _uiEvents.trigger(contentType.config.name + ":contentType:mount", {
          id: contentType.id,
          contentType: contentType
        });
      });
    };

    return Preview;
  }(_previewCollection);

  return Preview;
});
//# sourceMappingURL=preview.js.map
