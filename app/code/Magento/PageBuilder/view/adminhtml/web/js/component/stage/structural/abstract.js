/*eslint-disable */
define(["knockout", "mage/translate", "underscore", "../../config", "../../event-bus", "../../format/attribute-filter", "../../format/attribute-mapper", "../../format/style-attribute-filter", "../../format/style-attribute-mapper", "../edit", "./editable-area", "./options", "./options/option", "./options/title", "../../../utils/string"], function (_knockout, _translate, _underscore, _config, _eventBus, _attributeFilter, _attributeMapper, _styleAttributeFilter, _styleAttributeMapper, _edit, _editableArea, _options, _option, _title, _string) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Structural =
  /*#__PURE__*/
  function (_EditableArea) {
    _inheritsLoose(Structural, _EditableArea);

    /**
     * Abstract structural constructor
     *
     * @param parent
     * @param stage
     * @param config
     */
    function Structural(parent, stage, config, elementConverterPool, converterPool) {
      var _this;

      _this = _EditableArea.call(this, stage) || this;
      _this.config = void 0;
      _this.children = _knockout.observableArray([]);
      _this.edit = void 0;
      _this.title = void 0;
      _this.wrapperStyle = _knockout.observable({
        width: "100%"
      });
      _this.element = void 0;
      _this.attributeFilter = new _attributeFilter();
      _this.attributeMapper = new _attributeMapper();
      _this.styleAttributeFilter = new _styleAttributeFilter();
      _this.styleAttributeMapper = new _styleAttributeMapper();
      _this.data = {};
      _this.elementConverterPool = void 0;
      _this.converterPool = void 0;

      _this.setChildren(_this.children);

      _this.parent = parent;
      _this.config = config;
      _this.elementConverterPool = elementConverterPool;
      _this.converterPool = converterPool; // Create a new instance of edit for our editing needs

      _this.edit = new _edit(_this, _this.stage.store);

      _this.setupDataFields();

      return _this;
    }
    /**
     * Return an array of options
     *
     * @returns {Array<OptionInterface>}
     */


    var _proto = Structural.prototype;

    _proto.retrieveOptions = function retrieveOptions() {
      return [new _option.Option(this, "move", "<i></i>", (0, _translate)("Move"), null, ["move-structural"], 10), new _title.TitleOption(this, this.config.label, 20), new _option.Option(this, "edit", "<i></i>", (0, _translate)("Edit"), this.onOptionEdit, ["edit-block"], 30), new _option.Option(this, "duplicate", "<i class='icon-pagebuilder-copy'></i>", (0, _translate)("Duplicate"), this.onOptionDuplicate, ["duplicate-structural"], 40), new _option.Option(this, "remove", "<i></i>", (0, _translate)("Remove"), this.onOptionRemove, ["remove-structural"], 50)];
    };
    /**
     * Retrieve the template for the structural
     *
     * @returns {string}
     */


    /**
     * Handle user editing an instance
     */
    _proto.onOptionEdit = function onOptionEdit() {
      this.edit.open();
    };
    /**
     * Handle duplicate of items
     */


    _proto.onOptionDuplicate = function onOptionDuplicate() {
      this.parent.duplicateChild(this);
    };
    /**
     * Handle block removal
     */


    _proto.onOptionRemove = function onOptionRemove() {
      var _this2 = this;

      this.stage.parent.confirmationDialog({
        actions: {
          confirm: function confirm() {
            // Call the parent to remove the child element
            _eventBus.trigger("block:removed", {
              block: _this2,
              index: _this2.parent.children().indexOf(_this2),
              parent: _this2.parent
            });
          }
        },
        content: (0, _translate)("Are you sure you want to remove this item? " + "The data within this item is not recoverable once removed."),
        title: (0, _translate)("Confirm Item Removal")
      });
    };
    /**
     * Get css classes for an block
     * Example {"class-name": true}
     *
     * @returns {DataObject}
     */


    _proto.getCss = function getCss(element) {
      var css = {};
      var data = this.stage.store.get(this.id);

      if (element === undefined) {
        if ("css_classes" in data && data.css_classes !== "") {
          css = data.css_classes;
        }
      } else {
        var config = _config.getContentType(this.config.name).data_mapping.elements[element];

        if (config.css.var !== undefined && config.css.var in data) {
          css = data[config.css.var];
        }
      }

      css.toString().split(" ").map(function (value, index) {
        return css[value] = true;
      });
      return css;
    };
    /**
     * Get stype properties for an block
     * Example {"backgroundColor": "#cccccc"}
     *
     * @returns {DataObject}
     */


    _proto.getStyle = function getStyle(element) {
      if (element === undefined) {
        var styleAttributes = this.getData();

        if (typeof styleAttributes.appearance !== "undefined" && typeof styleAttributes.appearances !== "undefined" && typeof styleAttributes.appearances[styleAttributes.appearance] !== "undefined") {
          _underscore.extend(styleAttributes, styleAttributes.appearances[styleAttributes.appearance]);
        }

        return this.styleAttributeMapper.toDom(this.styleAttributeFilter.filter(styleAttributes));
      }

      var data = _underscore.extend({}, this.stage.store.get(this.id));

      var config = this.getAppearanceConfig(data["appearance"]).elements;
      var convertersConfig = this.getAppearanceConfig(data["appearance"]).converters;

      for (var key in this.converterPool.getConverters()) {
        for (var i = 0; i < convertersConfig.length; i++) {
          if (convertersConfig[i].name === key) {
            data = this.converterPool.getConverters()[key].beforeWrite(data, convertersConfig[i].config);
          }
        }
      }

      var result = {};

      if (config.style !== undefined) {
        result = this.convertStyle(config, data, "master");
      }

      return result;
    };
    /**
     * Convert style properties
     * 
     * @param {object}config
     * @param {object}data
     * @param {string} area
     * @returns {object}
     */


    _proto.convertStyle = function convertStyle(config, data, area) {
      var result = {};

      for (var i = 0; i < config.style.length; i++) {
        var styleProperty = config.style[i];
        var value = data[styleProperty.var];
        var mapper = styleProperty.var + styleProperty.name;

        if (mapper in this.elementConverterPool.getStyleConverters(area)) {
          value = this.elementConverterPool.getStyleConverters(area)[mapper].toDom(value, styleProperty.name, data);
        }

        result[(0, _string.fromSnakeToCamelCase)(styleProperty.name)] = value;
      }

      return result;
    };
    /**
     * Get attributes for an block
     * Example {"data-role": "element"}
     *
     * @returns {DataObject}
     */


    _proto.getAttributes = function getAttributes(element) {
      if (element === undefined) {
        var _data = this.getData();

        _underscore.extend(_data, this.config);

        return this.attributeMapper.toDom(this.attributeFilter.filter(_data));
      }

      var data = this.stage.store.get(this.id);
      data = _underscore.extend(data, this.config);

      var config = _config.getContentType(this.config.name).data_mapping.elements[element];

      var result = {};

      if (config.attributes !== undefined) {
        result = this.convertAttributes(config, data, "master");
      }

      return result;
    };
    /**
     * Convert attributes
     * 
     * @param {object}config
     * @param {DataObject} data
     * @param {string} area
     * @returns {object}
     */


    _proto.convertAttributes = function convertAttributes(config, data, area) {
      var result = {};

      for (var i = 0; i < config.attributes.length; i++) {
        var attribute = config.attributes[i];

        if (attribute.persist !== undefined && attribute.persist !== null && attribute.persist === 'false') {
          continue;
        }

        var value = data[attribute.var];
        var mapper = attribute.var + attribute.name;

        if (mapper in this.elementConverterPool.getAttributeConverters()) {
          value = this.elementConverterPool.getAttributeConverters()[mapper].toDom(value, attribute.var, data);
        }

        result[attribute.name] = value;
      }

      return result;
    };

    _proto.getHtml = function getHtml(element) {
      var data = this.stage.store.get(this.id);

      var config = _config.getContentType(this.config.name).data_mapping.elements[element];

      var result = '';

      if (config.html !== undefined) {
        result = data[config.html.var];
      }

      return result;
    };
    /**
     * Get block data
     *
     * @returns {DataObject}
     */


    _proto.getData = function getData() {
      return this.stage.store.get(this.id);
    };
    /**
     * Get the options instance
     *
     * @returns {Options}
     */


    _proto.getOptions = function getOptions() {
      return new _options.Options(this, this.retrieveOptions());
    };
    /**
     * Get config for appearance
     *
     * @param {string} appearance
     * @returns {Object}
     */


    _proto.getAppearanceConfig = function getAppearanceConfig(appearance) {
      var contentTypeConfig = _config.getContentType(this.config.name);

      var config = contentTypeConfig.data_mapping;

      if (appearance !== undefined && contentTypeConfig.appearances !== undefined && contentTypeConfig.appearances[appearance] !== undefined && contentTypeConfig.appearances[appearance].data_mapping !== undefined) {
        config = contentTypeConfig.appearances[appearance].data_mapping;
      }

      return config;
    };

    _proto.updateData = function updateData(data) {
      var config = this.getAppearanceConfig(data["appearance"]).elements;

      for (var elementName in config) {
        if (this.data[elementName] === undefined) {
          this.data[elementName] = {
            style: _knockout.observable({}),
            attributes: _knockout.observable({}),
            html: _knockout.observable({})
          };
        }

        if (config[elementName].style !== undefined) {
          this.data[elementName].style(this.convertStyle(config[elementName], data, "preview"));
        }

        if (config[elementName].attributes !== undefined) {
          this.data[elementName].attributes(this.convertAttributes(config[elementName], data, "preview"));
        }

        if (config[elementName].html !== undefined) {
          var html = data[config[elementName].html.var] !== undefined && data[config[elementName].html.var] !== "" ? data[config[elementName].html.var] : config[elementName].html.placeholder;
          this.data[elementName].html(html);
        }

        if (config[elementName].tag !== undefined) {
          if (this.data[elementName][config[elementName].tag.var] === undefined) {
            this.data[elementName][config[elementName].tag.var] = _knockout.observable("");
          }

          this.data[elementName][config[elementName].tag.var](data[config[elementName].tag.var]);
        }
      }
    };
    /**
     * Attach event to updating data in data store to update observables
     */


    _proto.setupDataFields = function setupDataFields() {
      var _this3 = this;

      this.stage.store.subscribe(function (data) {
        _this3.updateData(data);
      }, this.id);
    };

    _createClass(Structural, [{
      key: "template",
      get: function get() {
        return "Magento_PageBuilder/component/stage/structural/abstract.html";
      }
      /**
       * Retrieve the preview child template
       *
       * @returns {string}
       */

    }, {
      key: "previewChildTemplate",
      get: function get() {
        return "Magento_PageBuilder/component/block/preview/children.html";
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

    return Structural;
  }(_editableArea);

  return Structural;
});
//# sourceMappingURL=abstract.js.map
