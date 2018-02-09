/*eslint-disable */
define(["knockout", "../../config", "./block"], function (_knockout, _config, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var ContentBlock =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(ContentBlock, _PreviewBlock);

    /**
     * @param {Block} parent
     * @param {object} config
     * @param {Appearance} appearance
     */
    function ContentBlock(parent, config, appearance) {
      var _this;

      _this = _PreviewBlock.call(this, parent, config, appearance) || this;

      _this.updateDataValue("html", _knockout.observable(""));

      _this.parent.stage.store.subscribe(function (data) {
        if (data.identifier === "") {
          return;
        }

        var url = _config.getInitConfig("preview_url");

        var requestData = {
          identifier: data.identifier,
          role: _this.config.name
        };
        jQuery.post(url, requestData, function (response) {
          _this.updateDataValue("html", response.content !== undefined ? response.content.trim() : "");
        });
      }, _this.parent.id);

      return _this;
    }

    return ContentBlock;
  }(_block);

  return ContentBlock;
});
//# sourceMappingURL=content-block.js.map
