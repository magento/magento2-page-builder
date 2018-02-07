/*eslint-disable */
define(["knockout", "./block", "../../../utils/directives"], function (_knockout, _block, _directives) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Html =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Html, _PreviewBlock);

    /**
     * Constructor
     *
     * @param {Block} parent
     * @param {Object} config
     */
    function Html(parent, config) {
      var _this;

      _this = _PreviewBlock.call(this, parent, config) || this;

      _this.updateDataValue("html", _knockout.observable(""));

      _this.parent.stage.store.subscribe(function (data) {
        _this.updateDataValue("html", (0, _directives.convertMediaDirectivesToUrls)(_this.data.html()));
      }, _this.parent.id);

      return _this;
    }

    return Html;
  }(_block);

  return Html;
});
//# sourceMappingURL=html.js.map
