/*eslint-disable */
define(["jquery", "knockout", "mage/translate", "../config", "../stage/structural/options/option", "./block", "./column-group"], function (_jquery, _knockout, _translate, _config, _option, _block, _columnGroup) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

    _proto.bindEvents = function bindEvents() {
      _Block.prototype.bindEvents.call(this);

      if (_config.getContentTypeConfig("column-group")) {
        this.on("blockReady", this.createColumnGroup.bind(this));
      }
    };
    /**
     * Make a reference to the element in the column
     *
     * @param element
     */


    _proto.initColumn = function initColumn(element) {
      this.element = (0, _jquery)(element);
    };
    /**
     * Return an array of options
     *
     * @returns {Array<Option>}
     */


    /**
     * Init the resize handle for the resizing functionality
     *
     * @param handle
     */
    _proto.initResizeHandle = function initResizeHandle(handle) {
      var _this2 = this;

      _.defer(function () {
        _this2.emit("initResizing", {
          handle: (0, _jquery)(handle)
        });
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

        return _Block.prototype.createBlock.call(this, _config.getContentTypeConfig("column-group"), this.parent, index).then(function (columnGroup) {
          return Promise.all([_Block.prototype.createBlock.call(_this3, _this3.config, columnGroup, 0, {
            width: "50%"
          }), _Block.prototype.createBlock.call(_this3, _this3.config, columnGroup, 1, {
            width: "50%"
          })]).then(function () {
            return columnGroup;
          });
        });
      }
    };

    _createClass(Column, [{
      key: "options",
      get: function get() {
        var options = _Block.prototype.options;
        var newOptions = options.filter(function (option) {
          return option.code !== "move";
        });
        newOptions.unshift(new _option.Option(this, "move", "<i></i>", (0, _translate)("Move"), null, ["move-column"], 10));
        return newOptions;
      }
    }]);

    return Column;
  }(_block);

  return Column;
});
//# sourceMappingURL=column.js.map
