define(["knockout", "./block", "../../config"], function (_knockout, _block, _config) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var ContentBlock =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(ContentBlock, _PreviewBlock);

    function ContentBlock() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _PreviewBlock.call.apply(_PreviewBlock, [this].concat(args)) || this, _this.html = _knockout.observable('default'), _temp) || _this;
    }

    var _proto = ContentBlock.prototype;

    /**
     * Get the content of a static block
     *
     * @returns {DataObject}
     */
    _proto.getContent = function getContent() {
      var url = _config.getInitConfig('preview_url'),
          identifier = this.data.identifier(),
          data = {
        identifier: identifier,
        role: this.config.name
      };

      console.log('ko');
      console.log(this.html());
      this.html('anthoula');
      jQuery.post(url, data, function (data) {
        var html = JSON.stringify(data.content);
        console.log(_typeof(data));
        console.log(data);
        console.log(_typeof(html));
        console.log(html); // this.html(html);
      });
      return identifier;
    };

    return ContentBlock;
  }(_block);

  return ContentBlock;
});
//# sourceMappingURL=content-block.js.map
