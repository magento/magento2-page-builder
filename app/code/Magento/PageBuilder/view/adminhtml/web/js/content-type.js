/*eslint-disable */
define(["knockout", "Magento_PageBuilder/js/events", "mageUtils", "Magento_PageBuilder/js/data-store"], function (_knockout, _events, _mageUtils, _dataStore) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ContentType =
  /*#__PURE__*/
  function () {
    /**
     * @param {ContentTypeInterface} parent
     * @param {ContentTypeConfigInterface} config
     * @param {string} stageId
     */
    function ContentType(parent, config, stageId) {
      this.id = _mageUtils.uniqueid();
      this.data = {};
      this.wrapperStyle = _knockout.observable({
        width: "100%"
      });
      this.dataStore = new _dataStore();
      this.dropped = false;
      this.parent = parent;
      this.config = config;
      this.stageId = stageId;
      this.bindEvents();
    }

    var _proto = ContentType.prototype;

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

  return Object.assign(ContentType, {
    __esModule: true
  });
});
//# sourceMappingURL=content-type.js.map
