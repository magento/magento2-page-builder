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
      Object.defineProperty(this, "id", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: _mageUtils.uniqueid()
      });
      Object.defineProperty(this, "parent", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "stageId", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "config", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "data", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: {}
      });
      Object.defineProperty(this, "wrapperStyle", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: _knockout.observable({
          width: "100%"
        })
      });
      Object.defineProperty(this, "element", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "dataStore", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: new _dataStore()
      });
      Object.defineProperty(this, "preview", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "content", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "dropped", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: false
      });
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

  return ContentType;
});
//# sourceMappingURL=content-type.js.map
