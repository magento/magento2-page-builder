/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

define(["Magento_PageBuilder/js/events", "Magento_PageBuilder/js/content-type/preview", "Magento_PageBuilder/js/content-type/uploader"], function (_events, _preview, _uploader) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * @api
   */
  var Preview =
  /*#__PURE__*/
  function (_BasePreview) {
    _inheritsLoose(Preview, _BasePreview);

    function Preview() {
      return _BasePreview.apply(this, arguments) || this;
    }

    var _proto = Preview.prototype;

    /**
     * Uploader instance
     */

    /**
     * Get registry callback reference to uploader UI component
     *
     * @returns {Uploader}
     */
    _proto.getUploader = function getUploader() {
      return this.uploader;
    };
    /**
     * @inheritDoc
     */


    _proto.bindEvents = function bindEvents() {
      var _this = this;

      _BasePreview.prototype.bindEvents.call(this);

      _events.on(this.config.name + ":" + this.parent.id + ":updateAfter", function () {
        var dataStore = _this.parent.dataStore.get();

        var files = dataStore[_this.config.additional_data.uploaderConfig.dataScope];
        var imageObject = files ? files[0] : {};

        _events.trigger("image:" + _this.parent.id + ":assignAfter", imageObject);
      });

      _events.on(this.config.name + ":mountAfter", function () {
        var dataStore = _this.parent.dataStore.get();

        var initialImageValue = dataStore[_this.config.additional_data.uploaderConfig.dataScope] || ""; // Create uploader

        _this.uploader = new _uploader("imageuploader_" + _this.parent.id, _this.config.additional_data.uploaderConfig, _this.parent.id, _this.parent.dataStore, initialImageValue);
      });
    };

    return Preview;
  }(_preview);

  return _extends(Preview, {
    __esModule: true
  });
});
//# sourceMappingURL=preview.js.map
