/*eslint-disable */
define(["underscore", "Magento_PageBuilder/js/content-type/appearance-config"], function (_underscore, _appearanceConfig) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @api
   */
  var Master =
  /*#__PURE__*/
  function () {
    /**
     * @param {ContentTypeInterface} parent
     * @param {ObservableUpdater} observableUpdater
     */
    function Master(parent, observableUpdater) {
      this.data = {};
      this.parent = void 0;
      this.observableUpdater = void 0;
      this.parent = parent;
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
      var data = _underscore.extend({}, this.parent.dataStore.get());

      if (undefined === element) {
        return data;
      }

      var appearanceConfiguration = (0, _appearanceConfig)(this.parent.config.name, data.appearance);
      var config = appearanceConfiguration.data_mapping.elements;
      data = this.observableUpdater.convertData(data, appearanceConfiguration.data_mapping.converters);
      var result = {};

      if (undefined !== config[element].tag.var) {
        result[config[element].tag.var] = data[config[element].tag.var];
      }

      return result;
    };
    /**
     * Attach event to updating data in data store to update observables
     */


    _proto.bindEvents = function bindEvents() {
      var _this = this;

      this.parent.dataStore.subscribe(function (data) {
        _this.updateObservables();
      });
    };
    /**
     * After observables updated, allows to modify observables
     */


    _proto.afterObservablesUpdated = function afterObservablesUpdated() {
      return;
    };
    /**
     * Update observables
     */


    _proto.updateObservables = function updateObservables() {
      this.observableUpdater.update(this, _underscore.extend({
        name: this.parent.config.name
      }, this.parent.dataStore.get()));
      this.afterObservablesUpdated();
    };

    _createClass(Master, [{
      key: "renderTemplate",
      get: function get() {
        return (0, _appearanceConfig)(this.parent.config.name, this.getData().appearance).render_template;
      }
    }]);

    return Master;
  }();

  return Master;
});
//# sourceMappingURL=master.js.map
