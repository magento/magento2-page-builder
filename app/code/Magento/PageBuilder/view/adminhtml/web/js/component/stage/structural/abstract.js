/*eslint-disable */
define(["knockout", "mage/translate", "underscore", "../../config", "../../event-bus", "../../format/attribute-filter", "../../format/attribute-mapper", "../../format/style-attribute-filter", "../../format/style-attribute-mapper", "../edit", "./editable-area", "./options", "./options/option", "./options/title"], function (_knockout, _translate, _underscore, _config, _eventBus, _attributeFilter, _attributeMapper, _styleAttributeFilter, _styleAttributeMapper, _edit, _editableArea, _options, _option, _title) {
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
        var config = _config.getInitConfig("content_types")[this.config.name]['data_mapping']["elements"][element];

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

      var contentTypeConfig = _config.getInitConfig("content_types")[this.config.name];

      var config = contentTypeConfig["data_mapping"]["elements"][element];
      var convertersConfig = contentTypeConfig["data_mapping"]["converters"];
      var appearance = data["appearance"] !== undefined ? data["appearance"] : null;

      if (appearance && contentTypeConfig["appearances"] !== undefined && contentTypeConfig["appearances"][appearance] !== undefined && contentTypeConfig["appearances"][appearance]["data_mapping"] !== undefined) {
        config = contentTypeConfig["appearances"][appearance]["data_mapping"]["elements"][element];
        convertersConfig = contentTypeConfig["appearances"][appearance]["data_mapping"]["converters"];
      }

      for (var key in this.converterPool.getConverters()) {
        for (var i = 0; i < convertersConfig.length; i++) {
          if (convertersConfig[i].name === key) {
            data = this.converterPool.getConverters()[key].beforeWrite(data, convertersConfig[i].config);
          }
        }
      }

      var result = {};

      if (config.style !== undefined) {
        for (var _i = 0; _i < config.style.length; _i++) {
          var styleProperty = config.style[_i];
          var value = data[styleProperty.var];
          var mapper = styleProperty.var + styleProperty.name;

          if (mapper in this.elementConverterPool.getStyleConverters()) {
            value = this.elementConverterPool.getStyleConverters()[mapper].toDom(data[styleProperty.var], styleProperty.name, data);
          }

          result[this.fromSnakeToCamelCase(styleProperty.name)] = value;
        }
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

      var config = _config.getInitConfig("content_types")[this.config.name]['data_mapping']["elements"][element];

      var result = {};

      if (config.attributes !== undefined) {
        for (var i = 0; i < config.attributes.length; i++) {
          var attribute = config.attributes[i];

          if (attribute.persist !== undefined && attribute.persist !== null && attribute.persist === 'false') {
            continue;
          }

          var value = data[attribute.var];
          var mapper = attribute.var + attribute.name;

          if (mapper in this.elementConverterPool.getAttributeConverters()) {
            value = this.elementConverterPool.getAttributeConverters()[mapper].toDom(data[attribute.var], attribute.var, data);
          }

          result[attribute.name] = value;
        }
      }

      return result;
    };

    _proto.getHtml = function getHtml(element) {
      var data = this.stage.store.get(this.id);

      var config = _config.getInitConfig("content_types")[this.config.name]['data_mapping']["elements"][element];

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

    _proto.updateData = function updateData(data) {
      var contentTypeConfig = _config.getInitConfig("content_types")[this.config.name];

      var config = contentTypeConfig["data_mapping"]["elements"];
      var appearance = data["appearance"] !== undefined ? data["appearance"] : null;

      if (appearance && contentTypeConfig["appearances"] !== undefined && contentTypeConfig["appearances"][appearance] !== undefined && contentTypeConfig["appearances"][appearance]["data_mapping"] !== undefined) {
        config = contentTypeConfig["appearances"][appearance]["data_mapping"]["elements"];
      }

      for (var el in config) {
        if (this.data[el] === undefined) {
          this.data[el] = {
            style: _knockout.observable({}),
            attributes: _knockout.observable({}),
            html: _knockout.observable({})
          };
        }

        if (config[el].style !== undefined) {
          var styleObservable = {};

          for (var i = 0; i < config[el].style.length; i++) {
            var styleProperty = config[el].style[i];
            var value = data[styleProperty.var];
            var mapper = styleProperty.var + styleProperty.name;

            if (mapper in this.elementConverterPool.getStylePreviewConverters()) {
              value = this.elementConverterPool.getStylePreviewConverters()[mapper].toDom(value, styleProperty.name, this.stage.store.get(this.id));
            }

            styleObservable[this.fromSnakeToCamelCase(styleProperty.name)] = value;
          }

          this.data[el].style(styleObservable);
        }

        if (config[el].attributes !== undefined) {
          var attributesObservable = {};

          for (var _i2 = 0; _i2 < config[el].attributes.length; _i2++) {
            var attribute = config[el].attributes[_i2];
            var _value = data[attribute.var];

            if (attribute.var in this.elementConverterPool.getAttributeConverters()) {
              _value = this.elementConverterPool.getAttributeConverters()[attribute.var].toDom(data[attribute.var], attribute.var, data);
            }

            attributesObservable[attribute.name] = _value;
          }

          this.data[el].attributes(attributesObservable);
        }

        if (config[el].html !== undefined) {
          var html = data[config[el].html.var] !== undefined && data[config[el].html.var] !== "" ? data[config[el].html.var] : config[el].html.placeholder;
          this.data[el].html(html);
        }

        if (config[el].tag !== undefined) {
          if (this.data[el][config[el].tag.var] === undefined) {
            this.data[el][config[el].tag.var] = _knockout.observable(data[config[el].tag.var]);
          } else {
            this.data[el][config[el].tag.var](data[config[el].tag.var]);
          }
        }
      }
    };

    _proto.setupDataFields = function setupDataFields() {
      var _this3 = this;

      // Subscribe to this blocks data in the store
      this.stage.store.subscribe(function (data) {
        _underscore.forEach(data, function (value, key) {
          _this3.updateData(data);
        });
      }, this.id);
    };
    /**
     * Convert from snake case to camel case
     *
     * @param {string} string
     * @returns {string}
     */


    _proto.fromSnakeToCamelCase = function fromSnakeToCamelCase(currentString) {
      var parts = currentString.split(/[_-]/);
      var newString = "";

      for (var i = 1; i < parts.length; i++) {
        newString += parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
      }

      return parts[0] + newString;
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
