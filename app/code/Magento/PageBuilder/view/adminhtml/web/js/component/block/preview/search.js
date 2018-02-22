/*eslint-disable */
define(["knockout", "../../config", "./block"], function (_knockout, _config, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Search =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Search, _PreviewBlock);

    function Search() {
      return _PreviewBlock.apply(this, arguments) || this;
    }

    var _proto = Search.prototype;

    /**
     * Setup fields observables within the data class property
     */
    _proto.setupDataFields = function setupDataFields() {
      var _this = this;

      _PreviewBlock.prototype.setupDataFields.call(this);

      this.updateDataValue("html", _knockout.observable(""));
      this.parent.stage.store.subscribe(function (data) {
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
      }, this.parent.id);
    };

    return Search;
  }(_block);

  return Search;
});
//# sourceMappingURL=search.js.map
