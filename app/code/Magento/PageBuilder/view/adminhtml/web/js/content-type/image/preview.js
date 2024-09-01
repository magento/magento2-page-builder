/*eslint-disable */
/* jscs:disable */
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
define(["Magento_PageBuilder/js/events", "Magento_PageBuilder/js/content-type-menu/hide-show-option", "Magento_PageBuilder/js/uploader", "Magento_PageBuilder/js/content-type/preview"], function (_events, _hideShowOption, _uploader, _preview) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  /**
   * @api
   */
  var Preview = /*#__PURE__*/function (_preview2) {
    "use strict";

    function Preview() {
      return _preview2.apply(this, arguments) || this;
    }
    _inheritsLoose(Preview, _preview2);
    var _proto = Preview.prototype;
    /**
     * Return an array of options
     *
     * @returns {OptionsInterface}
     */
    _proto.retrieveOptions = function retrieveOptions() {
      var options = _preview2.prototype.retrieveOptions.call(this);
      options.hideShow = new _hideShowOption({
        preview: this,
        icon: _hideShowOption.showIcon,
        title: _hideShowOption.showText,
        action: this.onOptionVisibilityToggle,
        classes: ["hide-show-content-type"],
        sort: 40
      });
      return options;
    }

    /**
     * Get registry callback reference to uploader UI component
     *
     * @returns {Uploader}
     */;
    _proto.getUploader = function getUploader() {
      var initialImageValue = this.contentType.dataStore.get(this.config.additional_data.uploaderConfig.dataScope, "");
      return new _uploader("imageuploader_" + this.contentType.id, this.config.additional_data.uploaderConfig, this.contentType.id, this.contentType.dataStore, initialImageValue);
    }

    /**
     * Get viewport image data
     */;
    _proto.getViewportImageData = function getViewportImageData() {
      var desktopImageData = this.data.desktop_image;
      var mobileImageData = this.data.mobile_image;
      var result = this.viewport() === "mobile" && typeof mobileImageData !== "undefined" ? mobileImageData : desktopImageData;
      if (result && result.attributes() && result.attributes().src.length > 0 && result.attributes().src.indexOf("?rand") === -1) {
        result.attributes().src += "?rand=" + Date.now();
      }
      return result;
    }

    /**
     * @inheritDoc
     */;
    _proto.bindEvents = function bindEvents() {
      var _this = this;
      _preview2.prototype.bindEvents.call(this);
      _events.on("image:mountAfter", function (args) {
        if (args.id === _this.contentType.id) {
          _this.isSnapshot.subscribe(function (value) {
            _this.changeUploaderControlsVisibility();
          });
          _this.changeUploaderControlsVisibility();
        }
      });
      _events.on(this.config.name + ":" + this.contentType.id + ":updateAfter", function () {
        var files = _this.contentType.dataStore.get(_this.config.additional_data.uploaderConfig.dataScope);
        var imageObject = files ? files[0] : {};
        _events.trigger("image:" + _this.contentType.id + ":assignAfter", imageObject);
      });
    }

    /**
     * Change uploader controls visibility
     */;
    _proto.changeUploaderControlsVisibility = function changeUploaderControlsVisibility() {
      var _this2 = this;
      this.getUploader().getUiComponent()(function (uploader) {
        uploader.visibleControls = !_this2.isSnapshot();
      });
    };
    return Preview;
  }(_preview);
  return Preview;
});
//# sourceMappingURL=preview.js.map
