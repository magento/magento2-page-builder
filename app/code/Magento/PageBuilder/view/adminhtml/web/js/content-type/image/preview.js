/*eslint-disable */

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

define(["Magento_PageBuilder/js/events", "Magento_PageBuilder/js/content-type-menu/hide-show-option", "Magento_PageBuilder/js/uploader", "Magento_PageBuilder/js/content-type/preview"], function (_events, _hideShowOption, _uploader, _preview) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Preview =
  /*#__PURE__*/
  function (_preview2) {
    "use strict";

    _inheritsLoose(Preview, _preview2);

    function Preview() {
      return _preview2.apply(this, arguments) || this;
    }

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
     */
    ;

    _proto.getUploader = function getUploader() {
      var initialImageValue = this.contentType.dataStore.get(this.config.additional_data.uploaderConfig.dataScope, "");
      return new _uploader("imageuploader_" + this.contentType.id, this.config.additional_data.uploaderConfig, this.contentType.id, this.contentType.dataStore, initialImageValue);
    }
    /**
     * @inheritDoc
     */
    ;

    _proto.bindEvents = function bindEvents() {
      var _this = this;

      _preview2.prototype.bindEvents.call(this);

      _events.on(this.config.name + ":" + this.contentType.id + ":updateAfter", function () {
        var files = _this.contentType.dataStore.get(_this.config.additional_data.uploaderConfig.dataScope);

        var imageObject = files ? files[0] : {};

        _events.trigger("image:" + _this.contentType.id + ":assignAfter", imageObject);
      });
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map