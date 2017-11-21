define(["knockout", "./block", "../../config"], function (_knockout, _block, _config) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var ContentBlock =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(ContentBlock, _PreviewBlock);

    /**
     * PreviewBlock constructor
     *
     * @param {Block} parent
     * @param {Object} config
     */
    function ContentBlock(parent, config) {
      var _this;

      _this = _PreviewBlock.call(this, parent, config) || this;

      _this.updateDataValue('html', _knockout.observable(''));

      _this.parent.stage.store.subscribe(function (data) {
        if (data.identifier === '') {
          return;
        }

        var url = _config.getInitConfig('preview_url'),
            requestData = {
          identifier: data.identifier,
          role: _this.config.name
        };

        jQuery.post(url, requestData, function (response) {
          _this.updateDataValue('html', response.content.trim());
        });
      }, _this.parent.id);

      return _this;
    }

    return ContentBlock;
  }(_block);

  return ContentBlock;
});
//# sourceMappingURL=content-block.js.map
