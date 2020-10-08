/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/events", "mageUtils", "underscore", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/data-store"], function (_events, _mageUtils, _underscore, _config, _dataStore) {
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
      this.dataStores = {};
      this.dropped = false;
      this.parentContentType = parentContentType;
      this.config = config;
      this.stageId = stageId;
      this.initDataStores();
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
      this.dataStore.subscribe(function (state) {
        if (!_underscore.isEmpty(_this.dataStores)) {
          var viewport = _config.getConfig("viewport") || _config.getConfig("defaultViewport");

          _this.dataStores[viewport].setState(state);
        }

        return _events.trigger(eventName, paramObj);
      });
      this.dataStore.subscribe(function () {
        return _events.trigger("stage:updateAfter", {
          stageId: _this.stageId
        });
      });

      _events.on("stage:" + this.stageId + ":viewportChangeAfter", this.onViewportSwitch);
    }
    /**
     * Change data stores on viewport change.
     * @param {Object} args
     */
    ;

    _proto.onViewportSwitch = function onViewportSwitch(args) {
      if (this.dataStores[args.viewport]) {
        var currentViewportState = this.dataStores[args.viewport].getState();
        var previousViewportState = this.dataStore.getState();
        var viewportFields = this.getViewportFields(args.viewport, currentViewportState);
        var previousViewportFields = this.getViewportFields(args.previousViewport, previousViewportState); // Filter viewport specific data for states

        this.dataStore.setState(_underscore.extend(currentViewportState, _underscore.omit(previousViewportState, previousViewportFields), _underscore.pick(currentViewportState, viewportFields)));
      }
    }
    /**
     * Get viewport fields keys.
     *
     * @param {string} viewport
     * @param {DataObject} data
     */
    ;

    _proto.getViewportFields = function getViewportFields(viewport, data) {
      var viewportConfig = this.config.breakpoints[viewport];

      if (!viewportConfig) {
        return [];
      }

      var appearance = data.appearance + "-appearance";
      var fields = viewportConfig.fields[appearance] || viewportConfig.fields.default;
      return _underscore.keys(fields);
    }
    /**
     * Init data store for each viewport.
     */
    ;

    _proto.initDataStores = function initDataStores() {
      var _this2 = this;

      if (!_underscore.isEmpty(this.config.breakpoints)) {
        _underscore.each(this.config.breakpoints, function (value, name) {
          _this2.dataStores[name] = new _dataStore();
        });

        this.dataStores[_config.getConfig("defaultViewport")] = new _dataStore();
      }
    };

    return ContentType;
  }();

  return ContentType;
});
//# sourceMappingURL=content-type.js.map