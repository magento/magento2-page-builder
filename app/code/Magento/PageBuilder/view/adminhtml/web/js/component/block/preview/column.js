/*eslint-disable */
define(["jquery", "knockout", "mage/translate", "Magento_Ui/js/modal/alert", "uiEvents", "Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/preview-collection", "Magento_PageBuilder/js/component/config", "Magento_PageBuilder/js/component/stage/structural/options/option", "Magento_PageBuilder/js/component/block/column-group/resizing", "Magento_PageBuilder/js/component/block/preview/column-group/resizing"], function (_jquery, _knockout, _translate, _alert, _uiEvents, _contentTypeFactory, _previewCollection, _config, _option, _resizing, _resizing2) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Column =
  /*#__PURE__*/
  function (_PreviewCollection) {
    _inheritsLoose(Column, _PreviewCollection);

    /**
     * @param {ContentTypeInterface} parent
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    function Column(parent, config, observableUpdater) {
      var _this;

      _this = _PreviewCollection.call(this, parent, config, observableUpdater) || this;
      _this.resizing = _knockout.observable(false);

      _this.previewData.width.subscribe(function (newWidth) {
        var maxColumns = (0, _resizing2.getMaxColumns)();
        newWidth = parseFloat(newWidth);
        newWidth = Math.round(newWidth / (100 / maxColumns));
        var newLabel = newWidth + "/" + maxColumns;
        var column = (0, _translate)("Column");

        _this.displayLabel(column + " " + newLabel);
      });

      return _this;
    }
    /**
     * Bind events
     */


    var _proto = Column.prototype;

    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _PreviewCollection.prototype.bindEvents.call(this);

      if (_config.getContentTypeConfig("column-group")) {
        _uiEvents.on("column:block:mount", function (args) {
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
      this.parent.element = (0, _jquery)(element);

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
      newOptions.unshift(new _option.Option(this, "move", "<i class='icon-admin-pagebuilder-handle'></i>", (0, _translate)("Move"), null, ["move-column"], 10));
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

        this.parent.parent.removeChild(this.parent); // Create a new instance of column group to wrap our columns with

        return (0, _contentTypeFactory)(_config.getContentTypeConfig("column-group"), this.parent.parent, this.parent.stageId).then(function (columnGroup) {
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
     * @param {Column} child
     * @param {boolean} autoAppend
     * @returns {Promise<ContentTypeInterface>|void}
     */


    _proto.clone = function clone(child, autoAppend) {
      if (autoAppend === void 0) {
        autoAppend = true;
      }

      // Are we duplicating from a parent?
      if (child.config.name !== "column" || this.parent.parent.children().length === 0 || this.parent.parent.children().length > 0 && (0, _resizing2.getColumnsWidth)(this.parent.parent) < 100) {
        return _PreviewCollection.prototype.clone.call(this, child, autoAppend);
      } // Attempt to split the current column into parts


      var splitTimes = Math.round((0, _resizing2.getColumnWidth)(child) / (0, _resizing2.getSmallestColumnWidth)());

      if (splitTimes > 1) {
        _PreviewCollection.prototype.clone.call(this, child, autoAppend).then(function (duplicateBlock) {
          var originalWidth = 0;
          var duplicateWidth = 0;

          for (var i = 0; i <= splitTimes; i++) {
            if (splitTimes > 0) {
              originalWidth += (0, _resizing2.getSmallestColumnWidth)();
              --splitTimes;
            }

            if (splitTimes > 0) {
              duplicateWidth += (0, _resizing2.getSmallestColumnWidth)();
              --splitTimes;
            }
          }

          (0, _resizing.updateColumnWidth)(child, (0, _resizing2.getAcceptedColumnWidth)(originalWidth.toString()));
          (0, _resizing.updateColumnWidth)(duplicateBlock, (0, _resizing2.getAcceptedColumnWidth)(duplicateWidth.toString()));
          return duplicateBlock;
        });
      } else {
        // Conduct an outward search on the children to locate a suitable shrinkable column
        var shrinkableColumn = (0, _resizing2.findShrinkableColumn)(child);

        if (shrinkableColumn) {
          _PreviewCollection.prototype.clone.call(this, child, autoAppend).then(function (duplicateBlock) {
            (0, _resizing.updateColumnWidth)(shrinkableColumn, (0, _resizing2.getAcceptedColumnWidth)(((0, _resizing2.getColumnWidth)(shrinkableColumn) - (0, _resizing2.getSmallestColumnWidth)()).toString()));
            (0, _resizing.updateColumnWidth)(duplicateBlock, (0, _resizing2.getSmallestColumnWidth)());
            return duplicateBlock;
          });
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
     * Fire the mount event for blocks
     *
     * @param {ContentTypeInterface[]} blocks
     */


    _proto.fireMountEvent = function fireMountEvent() {
      for (var _len = arguments.length, blocks = new Array(_len), _key = 0; _key < _len; _key++) {
        blocks[_key] = arguments[_key];
      }

      blocks.forEach(function (block) {
        _uiEvents.trigger("block:mount", {
          id: block.id,
          block: block
        });

        _uiEvents.trigger(block.config.name + ":block:mount", {
          id: block.id,
          block: block
        });
      });
    };

    return Column;
  }(_previewCollection);

  return Column;
});
//# sourceMappingURL=column.js.map
