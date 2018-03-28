/*eslint-disable */
define(["../config", "./block"], function (_config, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Newsletter =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Newsletter, _Block);

    function Newsletter() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = Newsletter.prototype;

    _proto.afterDataRendered = function afterDataRendered() {
      var _this = this;

      var attributes = this.data.main.attributes();

      if (attributes["data-title"] === "") {
        return;
      }

      var url = _config.getInitConfig("preview_url");

      var requestData = {
        button_text: attributes["data-button-text"],
        label_text: attributes["data-label-text"],
        placeholder: attributes["data-placeholder"],
        role: this.config.name,
        title: attributes["data-title"]
      };
      jQuery.post(url, requestData, function (response) {
        _this.data.main.html(response.content !== undefined ? response.content.trim() : "");
      });
    };

    return Newsletter;
  }(_block);

  return Newsletter;
});
//# sourceMappingURL=newsletter.js.map
