/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/events", "mageUtils", "Magento_PageBuilder/js/data-store"], function (_events, _mageUtils, _dataStore) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ContentType =
  /*#__PURE__*/
  function () {
    "use strict";

    /**
     * @param {ContentTypeInterface} parentContentType
     * @param {ContentTypeConfigInterface} config
     * @param {string} stageId
     */
    function ContentType(parentContentType, config, stageId) {
      this.id = _mageUtils.uniqueid();
      this.dataStore = new _dataStore();
      this.dropped = false;
      this.parentContentType = parentContentType;
      this.config = config;
      this.stageId = stageId;
      this.bindEvents();
    }
    /**
     * Destroys current instance
     */


    var _proto = ContentType.prototype;

    _proto.destroy = function destroy() {
      var params = {
        contentType: this,
        index: this.parentContentType ? this.parentContentType.getChildren().indexOf(this) : null,
        parentContentType: this.parentContentType,
        stageId: this.stageId
      };
      this.preview ? this.preview.destroy() : this.content.destroy();

      _events.trigger("contentType:removeAfter", params);

      _events.trigger(this.config.name + ":removeAfter", params);
    };

    _proto.bindEvents = function bindEvents() {
      var _this = this;

      var eventName = this.config.name + ":" + this.id + ":updateAfter";
      var paramObj = {};
      paramObj[this.id] = this;
      this.dataStore.subscribe(function () {
        return _events.trigger(eventName, paramObj);
      });
      this.dataStore.subscribe(function () {
        return _events.trigger("stage:updateAfter", {
          stageId: _this.stageId
        });
      });
    };

    return ContentType;
  }();

  return ContentType;
});
//# sourceMappingURL=content-type.js.map