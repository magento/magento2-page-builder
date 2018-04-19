/*eslint-disable */
define(["uiEvents", "Magento_PageBuilder/js/component/config", "Magento_PageBuilder/js/component/block/block"], function (_uiEvents, _config, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Newsletter =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Newsletter, _Block);

    function Newsletter() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _Block.call.apply(_Block, [this].concat(args)) || this, _this.editOnInsert = false, _temp) || _this;
    }

    var _proto = Newsletter.prototype;

    /**
     * Bind events for the current instance
     */
    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _Block.prototype.bindEvents.call(this);

      _uiEvents.on("previewObservables:updated", function (event, args) {
        if (args.preview.id === _this2.id) {
          var attributes = _this2.data.main.attributes();

          if (attributes["data-title"] === "") {
            return;
          }

          var url = _config.getInitConfig("preview_url");

          var requestData = {
            button_text: attributes["data-button-text"],
            label_text: attributes["data-label-text"],
            placeholder: attributes["data-placeholder"],
            role: _this2.config.name,
            title: attributes["data-title"]
          };
          jQuery.post(url, requestData, function (response) {
            _this2.data.main.html(response.content !== undefined ? response.content.trim() : "");
          });
        }
      });
    };

    return Newsletter;
  }(_block);

  return Newsletter;
});
//# sourceMappingURL=newsletter.js.map
