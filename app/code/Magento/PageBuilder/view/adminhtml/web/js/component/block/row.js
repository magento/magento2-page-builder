/*eslint-disable */
define(["mage/translate", "../stage/structural/options/option", "./block"], function (_translate, _option, _block) {
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

      newOptions.push(new _option.Option(this, "remove", "<i></i>", (0, _translate)("Remove"), removeFn, removeClasses, 100));
      return newOptions;
    };

    return Row;
  }(_block);

  return Row;
});
//# sourceMappingURL=row.js.map
