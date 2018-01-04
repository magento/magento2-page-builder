define(["knockout", "./block", "../../config"], function (_knockout, _block, _config) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /*eslint-disable */
  var Newsletter =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Newsletter, _PreviewBlock);

    /**
     * PreviewBlock constructor
     *
     * @param {Block} parent
     * @param {Object} config
     */
    function Newsletter(parent, config) {
      var _this;

      _this = _PreviewBlock.call(this, parent, config) || this;

      _this.updateDataValue('html', _knockout.observable(''));

      _this.parent.stage.store.subscribe(function (data) {
        if (_this.data.title() === '') {
          return;
        }

        var url = _config.getInitConfig('preview_url'),
            requestData = {
          role: _this.config.name,
          'button_text': _this.data.button_text,
          'label_text': _this.data.label_text,
          'placeholder': _this.data.placeholder,
          'title': _this.data.title
        };

        jQuery.post(url, requestData, function (response) {
          _this.updateDataValue('html', response.content !== undefined ? response.content.trim() : '');
        });
      }, _this.parent.id);

      return _this;
    }

    return Newsletter;
  }(_block);

  return Newsletter;
});
//# sourceMappingURL=newsletter.js.map
