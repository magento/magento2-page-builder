/*eslint-disable */
define(["knockout", "mageUtils", "Magento_PageBuilder/js/component/data-store", "Magento_PageBuilder/js/component/event-bus"], function (_knockout, _mageUtils, _dataStore, _eventBus) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ContentType =
  /**
   * Abstract structural constructor
   *
   * @param parent
   * @param config
   * @param contentBuilder
   */
  function ContentType(parent, config, stageId, formData, previewBuilder, contentBuilder) {
    var _this = this;

    this.id = _mageUtils.uniqueid();
    this.stageId = void 0;
    this.config = void 0;
    this.data = {};
    this.wrapperStyle = _knockout.observable({
      width: "100%"
    });
    this.element = void 0;
    this.store = new _dataStore();
    this.preview = void 0;
    this.previewBuilder = void 0;
    this.content = void 0;
    this.contentBuilder = void 0;
    this.stageId = stageId;
    this.parent = parent;
    this.config = config;
    this.previewBuilder = previewBuilder;
    this.contentBuilder = contentBuilder;
    this.preview = this.previewBuilder.setContentType(this).build();
    this.content = this.contentBuilder.setContentType(this).build();
    var eventName = this.id + ":updated";
    var paramObj = {};
    paramObj[this.id] = this;
    this.store.subscribe(function () {
      return _eventBus.trigger(eventName, paramObj);
    });
    this.store.subscribe(function () {
      return _eventBus.trigger("stage:updated", {
        stageId: _this.stageId
      });
    });
    this.store.update(this.id, formData);
  };

  return ContentType;
});
//# sourceMappingURL=content-type.js.map
