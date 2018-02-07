/*eslint-disable */
define(["knockout", "./block", "../../config"], function (_knockout, _block, _config) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Html =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Html, _PreviewBlock);

    /**
     * Constructor
     *
     * @param {Block} parent
     * @param {Object} config
     */
    function Html(parent, config) {
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


    var _proto = Html.prototype;

    _proto.normalizeImageUrls = function normalizeImageUrls(html) {
      var mediaDirectiveRegExp = /\{\{\s*media\s+url\s*=\s*"?[^"\s\}]+"?\s*\}\}/g;
      var mediaDirectiveMatches = html.match(mediaDirectiveRegExp);

      if (mediaDirectiveMatches) {
        mediaDirectiveMatches.forEach(function (mediaDirective) {
          var urlRegExp = /\{\{\s*media\s+url\s*=\s*"?([^"\s\}]+)"?\s*\}\}/;
          var urlMatches = mediaDirective.match(urlRegExp);

          if (urlMatches && urlMatches[1] !== "undefined") {
            html = html.replace(mediaDirective, _config.getInitConfig('media_url') + urlMatches[1]);
          }
        });
      }

      return html;
    };

    return Html;
  }(_block);

  return Html;
});
//# sourceMappingURL=html.js.map
