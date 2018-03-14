/*eslint-disable */
define(["mage/translate", "underscore", "../stage/structural/options/option", "./block"], function (_translate, _underscore, _option, _block) {
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
     * Return an array of options
     *
     * @returns {Array<Option>}
     */
    _proto.retrieveOptions = function retrieveOptions() {
      var options = _Block.prototype.retrieveOptions.call(this);

      var newOptions = options.filter(function (option) {
        return option.code !== "remove";
      });
      var removeClasses = ["remove-structural"];
      var removeFn = this.onOptionRemove;

      if (this.stage.children().length < 2) {
        removeFn = function removeFn() {
          return;
        };

        removeClasses.push("disabled");
      }

      newOptions.push(new _option.Option(this, "remove", "<i class='icon-admin-pagebuilder-remove'></i>", (0, _translate)("Remove"), removeFn, removeClasses, 100));
      return newOptions;
    };
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
        styleAttributes.display = "flex";
      }

      return _underscore.extend(_Block.prototype.getStyle.call(this), styleAttributes);
    };

    return Row;
  }(_block);

  return Row;
});
//# sourceMappingURL=row.js.map
