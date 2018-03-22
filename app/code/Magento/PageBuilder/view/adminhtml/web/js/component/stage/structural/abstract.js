/*eslint-disable */
define(["knockout", "mage/translate", "underscore", "../../../component/block/appearance-config", "../../../utils/string", "../../event-bus", "../../format/attribute-filter", "../../format/attribute-mapper", "../../format/style-attribute-filter", "../../format/style-attribute-mapper", "../edit", "./editable-area", "./options", "./options/option", "./options/title"], function (_knockout, _translate, _underscore, _appearanceConfig, _string, _eventBus, _attributeFilter, _attributeMapper, _styleAttributeFilter, _styleAttributeMapper, _edit, _editableArea, _options, _option, _title) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
     * @param converterPool
     */
    function Structural(parent, stage, config, converterPool) {
      var _this;

      _this = _EditableArea.call(this, stage) || this;
      _this.config = void 0;
      _this.children = _knockout.observableArray([]);
      _this.edit = void 0;
      _this.title = void 0;
      _this.data = {};
      _this.wrapperStyle = _knockout.observable({
        width: "100%"
      });
      _this.element = void 0;
      _this.attributeFilter = new _attributeFilter();
      _this.attributeMapper = new _attributeMapper();
      _this.styleAttributeFilter = new _styleAttributeFilter();
      _this.styleAttributeMapper = new _styleAttributeMapper();
      _this.converterPool = void 0;

      _this.setChildren(_this.children);

      _this.parent = parent;
      _this.config = config;
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
     * Get data for css binding, example {"class-name": true}
     *
     * @returns {DataObject}
     */


    _proto.getCss = function getCss(element) {
      var result = {};
      var css = "";
      var data = this.stage.store.get(this.id);

      if (element === undefined) {
        if ("css_classes" in data && data.css_classes !== "") {
          css = data.css_classes;
        }
      } else {
        var config = (0, _appearanceConfig)(this.config.name, data.appearance).data_mapping.elements[element];

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

      var appearanceConfiguration = (0, _appearanceConfig)(this.config.name, data.appearance);
      var config = appearanceConfiguration.data_mapping.elements;
      var convertersConfig = appearanceConfiguration.data_mapping.converters;

      for (var i = 0; i < convertersConfig.length; i++) {
        data = this.converterPool.get(convertersConfig[i].component).toDom(data, convertersConfig[i].config);
      }

      var result = {};

      if (config[element] !== undefined) {
        result = this.convertStyle(config[element], data, "master");
      }

      return result;
    };
    /**
     * Get data for attr binding, example {"data-role": "element"}
     *
     * @returns {DataObject}
     */


    _proto.getAttributes = function getAttributes(element) {
      var data = this.stage.store.get(this.id);
      data = _underscore.extend(data, this.config);

      if (element === undefined) {
        if (undefined === data.appearance || !data.appearance) {
          data.appearance = undefined !== this.config.fields.appearance ? this.config.fields.appearance.default : "default";
        }

        return this.attributeMapper.toDom(this.attributeFilter.filter(data));
      }

      var config = (0, _appearanceConfig)(this.config.name, data.appearance).data_mapping.elements[element];
      var result = {};

      if (config.attributes !== undefined) {
        result = this.convertAttributes(config, data, "master");
      }

      return result;
    };
    /**
     * Get data for html binding
     *
     * @param {string} element
     * @returns {object}
     */


    _proto.getHtml = function getHtml(element) {
      var data = this.stage.store.get(this.id);
      var config = (0, _appearanceConfig)(this.config.name, data.appearance).data_mapping.elements[element];
      var result = "";

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
     * Convert attributes
     *
     * @param {object} config
     * @param {DataObject} data
     * @param {string} area
     * @returns {object}
     */


    _proto.convertAttributes = function convertAttributes(config, data, area) {
      var result = {};

      for (var i = 0; i < config.attributes.length; i++) {
        var attribute = config.attributes[i];

        if (attribute.persist !== undefined && attribute.persist !== null && attribute.persist === "false") {
          continue;
        }

        var value = data[attribute.var];
        var converter = "preview" === area && attribute.preview_converter ? attribute.preview_converter : attribute.converter;

        if (this.converterPool.get(converter)) {
          value = this.converterPool.get(converter).toDom(attribute.var, data);
        }

        result[attribute.name] = value;
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

      if (config.style) {
        for (var i = 0; i < config.style.length; i++) {
          var styleProperty = config.style[i];

          if (styleProperty.persist !== undefined && styleProperty.persist !== null && styleProperty.persist === "false") {
            continue;
          }

          var value = "";

          if (!!styleProperty.static) {
            value = styleProperty.value;
          } else {
            value = data[styleProperty.var];
            var converter = "preview" === area && styleProperty.preview_converter ? styleProperty.preview_converter : styleProperty.converter;

            if (this.converterPool.get(converter)) {
              value = this.converterPool.get(converter).toDom(styleProperty.var, data);
            }
          }

          if (_typeof(value) === "object") {
            _underscore.extend(result, value);
          } else {
            result[(0, _string.fromSnakeToCamelCase)(styleProperty.name)] = value;
          }
        }
      }

      return result;
    };
    /**
     * Update bindings after data changed in data store
     *
     * @param {object} data
     */


    _proto.updateData = function updateData(data) {
      var _this3 = this;

      var appearance = data && data.appearance !== undefined ? data.appearance : undefined;
      var appearanceConfiguration = (0, _appearanceConfig)(this.config.name, appearance);

      if (undefined === appearanceConfiguration || undefined === appearanceConfiguration.data_mapping || undefined === appearanceConfiguration.data_mapping.elements) {
        return;
      }

      var config = appearanceConfiguration.data_mapping.elements;

      for (var elementName in config) {
        if (this.data[elementName] === undefined) {
          this.data[elementName] = {
            attributes: _knockout.observable({}),
            css: _knockout.observable({}),
            style: _knockout.observable({}),
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
          var html = data[config[elementName].html.var] ? data[config[elementName].html.var] : config[elementName].html.placeholder;
          this.data[elementName].html(html);
        }

        if (config[elementName].css !== undefined && config[elementName].css.var in data) {
          (function () {
            var css = data[config[elementName].css.var];
            css.toString().split(" ").map(function (value, index) {
              return css[value] = true;
            });

            _this3.data[elementName].css(css);
          })();
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
      var _this4 = this;

      this.stage.store.subscribe(function (data) {
        _this4.updateData(_this4.stage.store.get(_this4.id));
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
