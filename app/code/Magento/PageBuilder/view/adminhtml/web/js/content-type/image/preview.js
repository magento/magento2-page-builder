/*eslint-disable */
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

define(["Magento_PageBuilder/js/events", "Magento_PageBuilder/js/uploader", "Magento_PageBuilder/js/content-type/preview"], function (_events, _uploader, _preview) {
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
     * Get registry callback reference to uploader UI component
     *
     * @returns {Uploader}
     */
    _proto.getUploader = function getUploader() {
      var dataStore = this.parent.dataStore.get();
      var initialImageValue = dataStore[this.config.additional_data.uploaderConfig.dataScope] || "";
      return new _uploader("imageuploader_" + this.parent.id, this.config.additional_data.uploaderConfig, this.parent.id, this.parent.dataStore, initialImageValue);
    };
    /**
     * @inheritDoc
     */


    _proto.bindEvents = function bindEvents() {
      var _this = this;

      _preview2.prototype.bindEvents.call(this);

      _events.on(this.config.name + ":" + this.parent.id + ":updateAfter", function () {
        var dataStore = _this.parent.dataStore.get();

        var files = dataStore[_this.config.additional_data.uploaderConfig.dataScope];
        var imageObject = files ? files[0] : {};

        _events.trigger("image:" + _this.parent.id + ":assignAfter", imageObject);
      });
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
