/*eslint-disable */
/* jscs:disable */

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

define(["underscore", "Magento_PageBuilder/js/utils/object", "Magento_PageBuilder/js/content-type/appearance-config"], function (_underscore, _object, _appearanceConfig) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Master =
  /*#__PURE__*/
  function () {
    "use strict";

    /**
     * @param {ContentTypeInterface} contentType
     * @param {ObservableUpdater} observableUpdater
     */
    function Master(contentType, observableUpdater) {
      this.data = {};
      this.contentType = contentType;
      this.observableUpdater = observableUpdater;
      this.bindEvents();
    }
    /**
     * Retrieve the render template
     *
     * @returns {string}
     */


    var _proto = Master.prototype;

    /**
     * Get content type data
     *
     * @param {string} element
     * @returns {DataObject}
     * @deprecated
     */
    _proto.getData = function getData(element) {
      var data = _underscore.extend({}, this.contentType.dataStore.getState());

      if (undefined === element) {
        return data;
      }

      var appearanceConfiguration = (0, _appearanceConfig)(this.contentType.config.name, data.appearance);
      var config = appearanceConfiguration.elements;
      data = this.observableUpdater.convertData(data, appearanceConfiguration.converters);
      var result = {};

      if (undefined !== config[element].tag.var) {
        result[config[element].tag.var] = (0, _object.get)(data, config[element].tag.var);
      }

      return result;
    }
    /**
     * Destroys current instance
     */
    ;

    _proto.destroy = function destroy() {
      return;
    }
    /**
     * Attach event to updating data in data store to update observables
     */
    ;

    _proto.bindEvents = function bindEvents() {
      var _this = this;

      this.contentType.dataStore.subscribe(function () {
        _this.updateObservables();
      });
    }
    /**
     * After observables updated, allows to modify observables
     */
    ;

    _proto.afterObservablesUpdated = function afterObservablesUpdated() {
      return;
    }
    /**
     * Update observables
     *
     * @deprecated
     */
    ;

    _proto.updateObservables = function updateObservables() {
      this.observableUpdater.update(this, _underscore.extend({
        name: this.contentType.config.name
      }, this.contentType.dataStore.getState()), this.contentType.getDataStoresStates());
      this.afterObservablesUpdated();
    };

    _createClass(Master, [{
      key: "template",
      get: function get() {
        return (0, _appearanceConfig)(this.contentType.config.name, this.getData().appearance).master_template;
      }
    }]);

    return Master;
  }();

  return Master;
});
//# sourceMappingURL=master.js.map