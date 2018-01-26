/*eslint-disable */
define(["knockout", "../../config", "./block"], function (_knockout, _config, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Search =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Search, _PreviewBlock);

    /**
     * PreviewBlock constructor
     *
     * @param {Block} parent
     * @param {Object} config
     */
    function Search(parent, config) {
      var _this;

      _this = _PreviewBlock.call(this, parent, config) || this;

      _this.updateDataValue("html", _knockout.observable(""));

      _this.parent.stage.store.subscribe(function (data) {
        if (_this.data.placeholder() === "") {
          return;
        }

        var url = _config.getInitConfig("preview_url");

        var requestData = {
          placeholder: _this.data.placeholder,
          role: _this.config.name
        };
        jQuery.post(url, requestData, function (response) {
          _this.updateDataValue("html", response.content !== undefined ? response.content.trim() : "");
        });
      }, _this.parent.id);

      return _this;
    }

    return Search;
  }(_block);

  return Search;
});
//# sourceMappingURL=search.js.map
