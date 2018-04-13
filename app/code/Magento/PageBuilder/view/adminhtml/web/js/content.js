/*eslint-disable */
define(["underscore", "Magento_PageBuilder/js/component/block/appearance-config", "Magento_PageBuilder/js/component/format/attribute-filter", "Magento_PageBuilder/js/component/format/attribute-mapper", "Magento_PageBuilder/js/component/format/style-attribute-filter", "Magento_PageBuilder/js/component/format/style-attribute-mapper"], function (_underscore, _appearanceConfig, _attributeFilter, _attributeMapper, _styleAttributeFilter, _styleAttributeMapper) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var Content =
  /*#__PURE__*/
  function () {
    /**
     * @deprecated
     */

    /**
     * @deprecated
     */

    /**
     * @deprecated
     */

    /**
     * @deprecated
     */

    /**
     * @param {ContentTypeInterface} parent
     * @param {ObservableUpdater} observableUpdater
     */
    function Content(parent, observableUpdater) {
      this.data = {};
      this.parent = void 0;
      this.observableUpdater = void 0;
      this.attributeFilter = new _attributeFilter();
      this.attributeMapper = new _attributeMapper();
      this.styleAttributeFilter = new _styleAttributeFilter();
      this.styleAttributeMapper = new _styleAttributeMapper();
      this.parent = parent;
      this.observableUpdater = observableUpdater;
      this.bindEvents();
    }
    /**
     * Retrieve the render template
     *
     * @returns {string}
     */


    var _proto = Content.prototype;

    /**
     * Get data for css binding, example {"class-name": true}
     *
     * @returns {DataObject}
     * @deprecated
     */
    _proto.getCss = function getCss(element) {
      var result = {};
      var css = "";
      var data = this.parent.store.get(this.parent.id);

      if (element === undefined) {
        if ("css_classes" in data && data.css_classes !== "") {
          css = data.css_classes;
        }
      } else {
        var config = (0, _appearanceConfig)(this.parent.config.name, data.appearance).data_mapping.elements[element];

        if (config.css && config.css.var !== undefined && config.css.var in data) {
          css = data[config.css.var];
        }
      }

      if (css) {
        css.toString().split(" ").map(function (value, index) {
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
      var data = _underscore.extend({}, this.parent.store.get(this.parent.id), this.parent.config);

      if (element === undefined) {
        if (typeof data.appearance !== "undefined" && typeof data.appearances !== "undefined" && typeof data.appearances[data.appearance] !== "undefined") {
          _underscore.extend(data, data.appearances[data.appearance]);
        }

        return this.styleAttributeMapper.toDom(this.styleAttributeFilter.filter(data));
      }

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
      var data = _underscore.extend({}, this.parent.store.get(this.parent.id), this.parent.config);

      if (element === undefined) {
        if (undefined === data.appearance || !data.appearance) {
          data.appearance = undefined !== this.parent.config.fields.appearance ? this.parent.config.fields.appearance.default : "default";
        }

        return this.attributeMapper.toDom(this.attributeFilter.filter(data));
      }

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
      var data = this.parent.store.get(this.parent.id);
      var config = (0, _appearanceConfig)(this.parent.config.name, data.appearance).data_mapping.elements[element];
      var result = "";

      if (undefined !== config.html.var) {
        result = this.observableUpdater.convertHtml(config, data, "master");
      }

      return result;
    };
    /**
     * Get block data
     *
     * @param {string} element
     * @returns {DataObject}
     * @deprecated
     */


    _proto.getData = function getData(element) {
      var data = _underscore.extend({}, this.parent.store.get(this.parent.id));

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

      this.parent.store.subscribe(function (data) {
        _this.observableUpdater.update(_this, _underscore.extend({
          name: _this.parent.config.name
        }, _this.parent.store.get(_this.parent.id)));
      }, this.parent.id);
    };

    _createClass(Content, [{
      key: "renderTemplate",
      get: function get() {
        return (0, _appearanceConfig)(this.parent.config.name, this.getData().appearance).render_template;
      }
      /**
       * Retrieve the child template
       *
       * @returns {string}
       */

    }, {
      key: "renderChildTemplate",
      get: function get() {
        return "Magento_PageBuilder/component/block/render/children.html";
      }
    }]);

    return Content;
  }();

  return Content;
});
//# sourceMappingURL=content.js.map
