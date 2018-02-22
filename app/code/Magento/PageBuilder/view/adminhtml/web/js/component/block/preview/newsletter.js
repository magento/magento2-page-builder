/*eslint-disable */
define(["knockout", "../../config", "./block"], function (_knockout, _config, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Newsletter =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Newsletter, _PreviewBlock);

    function Newsletter() {
      return _PreviewBlock.apply(this, arguments) || this;
    }

    var _proto = Newsletter.prototype;

    /**
     * Setup fields observables within the data class property
     */
    _proto.setupDataFields = function setupDataFields() {
      var _this = this;

      _PreviewBlock.prototype.setupDataFields.call(this);

      this.updateDataValue("html", _knockout.observable(""));
      this.parent.stage.store.subscribe(function (data) {
        if (_this.data.title() === "") {
          return;
        }

        var url = _config.getInitConfig("preview_url");

        var requestData = {
          button_text: _this.data.button_text,
          label_text: _this.data.label_text,
          placeholder: _this.data.placeholder,
          role: _this.config.name,
          title: _this.data.title
        };
        jQuery.post(url, requestData, function (response) {
          _this.updateDataValue("html", response.content !== undefined ? response.content.trim() : "");
        });
      }, this.parent.id);
    };

    return Newsletter;
  }(_block);

  return Newsletter;
});
//# sourceMappingURL=newsletter.js.map
