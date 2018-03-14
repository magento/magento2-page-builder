/*eslint-disable */
define(["jquery", "knockout", "mage/translate", "../config", "../event-bus", "../stage/structural/options/option", "./block", "./column-group", "./factory"], function (_jquery, _knockout, _translate, _config, _eventBus, _option, _block, _columnGroup, _factory) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Column =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Column, _Block);

    function Column() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _Block.call.apply(_Block, [this].concat(args)) || this, _this.resizing = _knockout.observable(false), _temp) || _this;
    }

    var _proto = Column.prototype;

    /**
     * Bind events for the current instance
     */
    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _Block.prototype.bindEvents.call(this);

      if (_config.getContentType("column-group")) {
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
        column: this,
        element: (0, _jquery)(element),
        parent: this.parent
      });
    };
    /**
     * Return an array of options
     *
     * @returns {Array<OptionInterface>}
     */


    _proto.retrieveOptions = function retrieveOptions() {
      var options = _Block.prototype.retrieveOptions.call(this);

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
        column: this,
        handle: (0, _jquery)(handle),
        parent: this.parent
      });
    };
    /**
     * Wrap the current column in a group
     *
     * @returns {Promise<Block>}
     */


    _proto.createColumnGroup = function createColumnGroup() {
      var _this3 = this;

      if (!(this.parent instanceof _columnGroup)) {
        var index = this.parent.children().indexOf(this); // Remove child instantly to stop content jumping around

        this.parent.removeChild(this); // Create a new instance of column group to wrap our columns with

        return (0, _factory)(_config.getContentType("column-group"), this.parent, this.parent.stage).then(function (columnGroup) {
          return Promise.all([(0, _factory)(_this3.config, columnGroup, columnGroup.stage, {
            width: "50%"
          }), (0, _factory)(_this3.config, columnGroup, columnGroup.stage, {
            width: "50%"
          })]).then(function (columns) {
            columnGroup.addChild(columns[0], 0);
            columnGroup.addChild(columns[1], 1);

            _this3.parent.addChild(columnGroup, index);

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
      for (var _len2 = arguments.length, blocks = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        blocks[_key2] = arguments[_key2];
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
  }(_block);

  return Column;
});
//# sourceMappingURL=column.js.map
