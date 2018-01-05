define(["knockout", "./block", "../../config"], function (_knockout, _block, _config) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  'use strict';
  /*eslint-disable */


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

      _this.updateDataValue('html', _knockout.observable(''));

      _this.parent.stage.store.subscribe(function (data) {
        if (_this.data.placeholder() === '') {
          return;
        }

        var url = _config.getInitConfig('preview_url'),
            requestData = {
          role: _this.config.name,
          'placeholder': _this.data.placeholder
        };

        jQuery.post(url, requestData, function (response) {
          _this.updateDataValue('html', response.content !== undefined ? response.content.trim() : '');
        });
      }, _this.parent.id);

      return _this;
    }

    return Search;
  }(_block);

  return Search;
});
//# sourceMappingURL=search.js.map
