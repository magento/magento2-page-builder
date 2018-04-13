/*eslint-disable */
define(["jquery", "knockout", "mage/translate", "Magento_PageBuilder/js/preview", "Magento_PageBuilder/js/component/config", "Magento_PageBuilder/js/component/event-bus", "Magento_PageBuilder/js/component/stage/structural/options/option", "Magento_PageBuilder/js/component/block/factory", "Magento_PageBuilder/js/component/block/preview/column-group", "Magento_PageBuilder/js/component/block/preview/column-group/resizing"], function (_jquery, _knockout, _translate, _preview, _config, _eventBus, _option, _factory, _columnGroup, _resizing) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Column =
  /*#__PURE__*/
  function (_Preview) {
    _inheritsLoose(Column, _Preview);

    /**
     * @param {Block} parent
     * @param {ConfigContentBlock} config
     */
    function Column(parent, config, elementDataConverterPool, dataConverterPool) {
      var _this;

      _this = _Preview.call(this, parent, config, elementDataConverterPool, dataConverterPool) || this;
      _this.resizing = _knockout.observable(false);

      _this.previewData.width.subscribe(function (newWidth) {
        var maxColumns = (0, _resizing.getMaxColumns)();
        newWidth = parseFloat(newWidth);
        newWidth = Math.round(newWidth / (100 / maxColumns));
        var newLabel = newWidth + "/" + maxColumns;
        var column = (0, _translate)("Column");

        _this.displayLabel(column + " " + newLabel);
      });

      return _this;
    }
    /**
     * Update the style attribute mapper converts images to directives, override it to include the correct URL
     *
     * @returns styles
     */


    var _proto = Column.prototype;

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
     * Bind events for the current instance
     */


    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _Preview.prototype.bindEvents.call(this);

      if (_config.getContentTypeConfig("column-group")) {
        _eventBus.on("column:block:mount", function (event, params) {
          if (params.id === _this2.id) {
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

      _eventBus.trigger("column:initElement", {
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
      var options = _Preview.prototype.retrieveOptions.call(this);

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
      _eventBus.trigger("column:bindResizeHandle", {
        column: this.parent,
        handle: (0, _jquery)(handle),
        parent: this.parent.parent
      });
    };
    /**
     * Wrap the current column in a group
     *
     * @returns {Promise<Block>}
     */


    _proto.createColumnGroup = function createColumnGroup() {
      var _this3 = this;

      if (!(this.parent.parent instanceof _columnGroup)) {
        var index = this.parent.children().indexOf(this.parent); // Remove child instantly to stop content jumping around

        this.parent.parent.removeChild(this); // Create a new instance of column group to wrap our columns with

        return (0, _factory)(_config.getContentTypeConfig("column-group"), this.parent.parent, this.parent.stageId).then(function (columnGroup) {
          return Promise.all([(0, _factory)(_this3.parent.config, columnGroup, columnGroup.stageId, {
            width: "50%"
          }), (0, _factory)(_this3.parent.config, columnGroup, columnGroup.stageId, {
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
     * Fire the mount event for blocks
     *
     * @param {Block} blocks
     */


    _proto.fireMountEvent = function fireMountEvent() {
      for (var _len = arguments.length, blocks = new Array(_len), _key = 0; _key < _len; _key++) {
        blocks[_key] = arguments[_key];
      }

      blocks.forEach(function (block) {
        _eventBus.trigger("block:mount", {
          id: block.id,
          block: block
        });

        _eventBus.trigger(block.config.name + ":block:mount", {
          id: block.id,
          block: block
        });
      });
    };

    return Column;
  }(_preview);

  return Column;
});
//# sourceMappingURL=column.js.map
