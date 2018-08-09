/*eslint-disable */
define(["Magento_PageBuilder/js/content-type-menu/conditional-remove", "Magento_PageBuilder/js/content-type/preview-collection"], function (_conditionalRemove, _previewCollection) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * @api
   */
  var Preview =
  /*#__PURE__*/
  function (_PreviewCollection) {
    _inheritsLoose(Preview, _PreviewCollection);

    function Preview() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _PreviewCollection.call.apply(_PreviewCollection, [this].concat(args)) || this, _this.fieldsToIgnoreOnRemove = ["tab_name"], _temp) || _this;
    }

    var _proto = Preview.prototype;

    /**
     * Get the options instance
     *
     * @returns {OptionsInterface}
     */
    _proto.retrieveOptions = function retrieveOptions() {
      var options = _PreviewCollection.prototype.retrieveOptions.call(this);

      delete options.move;
      delete options.title;
      options.remove = new _conditionalRemove(options.remove.config);
      return options;
    };

    return Preview;
  }(_previewCollection);

  return Preview;
});
//# sourceMappingURL=preview.js.map
