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
     * Get data for css binding, example {"class-name": true}
     *
     * @returns {DataObject}
     * @deprecated
     */
    _proto.getCss = function getCss(element) {
      var result = {};
      var css = "";

      var data = _underscore.extend({}, this.parent.dataStore.get());

      if (element === undefined) {
        if ("css_classes" in data && data.css_classes !== "") {
          css = data.css_classes.toString();
        }
      } else {
        var appearanceConfiguration = (0, _appearanceConfig)(this.parent.config.name, data.appearance);
        var config = appearanceConfiguration.data_mapping.elements[element];

        if (config.css && config.css.var !== undefined && config.css.var in data) {
          data = this.observableUpdater.convertData(data, appearanceConfiguration.data_mapping.converters);
          css = data[config.css.var].toString();
        }
      }

      if (css) {
        css.split(" ").map(function (value, index) {
          return result[value] = true;
        });
      }

      return result;
    };
    /**
     * Get data for style binding, example {"backgroundColor": "#cccccc"}
     *
     * @returns {DataObject}
     * @deprecated
     */


    _proto.getStyle = function getStyle(element) {
      var data = _underscore.extend({}, this.parent.dataStore.get(), this.parent.config);

      var appearanceConfiguration = (0, _appearanceConfig)(this.parent.config.name, data.appearance);
      var config = appearanceConfiguration.data_mapping.elements;
      data = this.observableUpdater.convertData(data, appearanceConfiguration.data_mapping.converters);
      var result = {};

      if (config[element].style.length) {
        result = this.observableUpdater.convertStyle(config[element], data, "master");
      }

      return result;
    };
    /**
     * Get data for attr binding, example {"data-role": "element"}
     *
     * @returns {DataObject}
     * @deprecated
     */


    _proto.getAttributes = function getAttributes(element) {
      var data = _underscore.extend({}, this.parent.dataStore.get(), this.parent.config);

      var appearanceConfiguration = (0, _appearanceConfig)(this.parent.config.name, data.appearance);
      var config = appearanceConfiguration.data_mapping.elements;
      data = this.observableUpdater.convertData(data, appearanceConfiguration.data_mapping.converters);
      var result = {};

      if (config[element].attributes.length) {
        result = this.observableUpdater.convertAttributes(config[element], data, "master");
      }

      return result;
    };
    /**
     * Get data for html binding
     *
     * @param {string} element
     * @returns {object}
     * @deprecated
     */


    _proto.getHtml = function getHtml(element) {
      var data = this.parent.dataStore.get();
      var config = (0, _appearanceConfig)(this.parent.config.name, data.appearance).data_mapping.elements[element];
      var result = "";

      if (undefined !== config.html.var) {
        result = this.observableUpdater.convertHtml(config, data, "master");
      }

      return result;
    };
    /**
     * Get content type data
     *
     * @param {string} element
     * @returns {DataObject}
     * @deprecated
     */


    _proto.getData = function getData(element) {
      var data = _underscore.extend({}, this.parent.dataStore.get());

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
