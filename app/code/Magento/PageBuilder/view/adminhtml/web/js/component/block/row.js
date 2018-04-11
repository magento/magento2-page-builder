/*eslint-disable */
define(["mage/translate", "Magento_PageBuilder/js/content-type-collection", "Magento_PageBuilder/js/component/stage/structural/options/option"], function (_translate, _contentTypeCollection, _option) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Row =
  /*#__PURE__*/
  function (_ContentTypeCollectio) {
    _inheritsLoose(Row, _ContentTypeCollectio);

    function Row() {
      return _ContentTypeCollectio.apply(this, arguments) || this;
    }

    var _proto = Row.prototype;

    /**
     * Return an array of options
     *
     * @returns {Array<Option>}
     */
    _proto.retrieveOptions = function retrieveOptions() {
      var options = _ContentTypeCollectio.prototype.retrieveOptions.call(this);

      var newOptions = options.filter(function (option) {
        return option.code !== "remove";
      });
      var removeClasses = ["remove-structural"];
      var removeFn = this.onOptionRemove;

      if (this.parent.children().length < 2) {
        removeFn = function removeFn() {
          return;
        };

        removeClasses.push("disabled");
      }

      newOptions.push(new _option.Option(this, "remove", "<i class='icon-admin-pagebuilder-remove'></i>", (0, _translate)("Remove"), removeFn, removeClasses, 100));
      return newOptions;
    };

    return Row;
  }(_contentTypeCollection);

  return Row;
});
//# sourceMappingURL=row.js.map
