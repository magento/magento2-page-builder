/*eslint-disable */
define(["knockout", "jquery", "./block", "../../config"], function (_knockout, _jquery, _block, _config) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Code =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Code, _PreviewBlock);

    /**
     * Constructor
     *
     * @param {Block} parent
     * @param {Object} config
     */
    function Code(parent, config) {
      var _this;

      _this = _PreviewBlock.call(this, parent, config) || this;

      _this.updateDataValue("html", _knockout.observable(""));

      _this.parent.stage.store.subscribe(function (data) {
        _this.updateDataValue("html", _this.normalizeImageUrls(_this.data.html()));
      }, _this.parent.id);

      return _this;
    }
    /**
     * Replace media directives with actual media URLs
     *
     * @param {string} html
     * @returns {string}
     */


    var _proto = Code.prototype;

    _proto.normalizeImageUrls = function normalizeImageUrls(html) {
      var container = (0, _jquery)('<div />');
      container.append(html);
      container.find("img").each(function (index, value) {
        var matches = /url="?([^"\\\s\}]+)"?/.exec((0, _jquery)(value).attr('src'));

        if (typeof matches[1] != "undefined") {
          (0, _jquery)(value).attr('src', _config.getInitConfig('media_url') + matches[1]);
        }
      });
      return container.html();
    };

    return Code;
  }(_block);

  return Code;
});
//# sourceMappingURL=html.js.map
