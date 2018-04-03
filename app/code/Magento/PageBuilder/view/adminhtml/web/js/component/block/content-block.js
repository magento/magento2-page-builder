/*eslint-disable */
define(["../config", "../event-bus", "./block"], function (_config, _eventBus, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var ContentBlock =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(ContentBlock, _Block);

    function ContentBlock() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _Block.call.apply(_Block, [this].concat(args)) || this, _this.editOnInsert = false, _temp) || _this;
    }

    var _proto = ContentBlock.prototype;

    /**
     * Bind events for the current instance
     */
    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _Block.prototype.bindEvents.call(this);

      _eventBus.on("previewObservables:updated", function (event, params) {
        var attributes = _this2.data.main.attributes();

        if (attributes["data-identifier"] === "") {
          return;
        }

        var url = _config.getInitConfig("preview_url");

        var requestData = {
          identifier: attributes["data-identifier"],
          role: _this2.config.name
        };
        jQuery.post(url, requestData, function (response) {
          _this2.data.main.html(response.content !== undefined ? response.content.trim() : "");
        });
      });
    };

    return ContentBlock;
  }(_block);

  return ContentBlock;
});
//# sourceMappingURL=content-block.js.map
