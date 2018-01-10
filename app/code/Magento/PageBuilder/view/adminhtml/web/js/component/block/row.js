/*eslint-disable */
define(["mage/translate", "underscore", "../stage/structural/options/option", "./block"], function (_translate, _underscore, _option, _block) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Row =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Row, _Block);

    function Row() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = Row.prototype;

    /**
     * Get stype properties for an block
     * Example {"backgroundColor": "#cccccc"}
     *
     * @returns {DataObject}
     */
    _proto.getStyle = function getStyle() {
      var children = this.children();
      var styleAttributes = {};
      var isAllColumns = true;

      if (children.length !== 0) {
        for (var _iterator = children, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
          }

          var _child = _ref;

          if (_child.config.name !== "column") {
            isAllColumns = false;
          }
        }
      } else {
        isAllColumns = false;
      }

      if (isAllColumns) {
        var display = "display";
        styleAttributes[display] = "flex";
      }

      return _underscore.extend(_Block.prototype.getStyle.call(this), styleAttributes);
    };

    _createClass(Row, [{
      key: "options",

      /**
       * Return an array of options
       *
       * @returns {Array<Option>}
       */
      get: function get() {
        var removeOption;

        if (this.stage.children().length < 2) {
          removeOption = new _option.Option(this, "remove", "<i></i>", (0, _translate)("Remove"), function () {
            return;
          }, ["remove-structural disabled"], 100);
        } else {
          removeOption = new _option.Option(this, "remove", "<i></i>", (0, _translate)("Remove"), this.onOptionRemove, ["remove-structural"], 100);
        }

        return [new _option.Option(this, "move", "<i></i>", (0, _translate)("Move"), false, ["move-structural"], 10), new _option.Option(this, "edit", "<i></i>", (0, _translate)("Edit"), this.onOptionEdit, ["edit-block"], 50), new _option.Option(this, "duplicate", "<i class='icon-pagebuilder-copy'></i>", (0, _translate)("Duplicate"), this.onOptionDuplicate, ["duplicate-structural"], 60), removeOption];
      }
    }]);

    return Row;
  }(_block);

  return Row;
});
//# sourceMappingURL=row.js.map
