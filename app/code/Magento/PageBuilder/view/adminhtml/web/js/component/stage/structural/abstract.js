/*eslint-disable */
define(["knockout", "mage/translate", "Magento_PageBuilder/js/modal/dismissible-confirm", "underscore", "Magento_PageBuilder/js/component/block/appearance-config", "Magento_PageBuilder/js/utils/string", "Magento_PageBuilder/js/component/event-bus", "Magento_PageBuilder/js/component/format/attribute-filter", "Magento_PageBuilder/js/component/format/attribute-mapper", "Magento_PageBuilder/js/component/format/style-attribute-filter", "Magento_PageBuilder/js/component/format/style-attribute-mapper", "Magento_PageBuilder/js/component/stage/edit", "Magento_PageBuilder/js/component/stage/structural/editable-area", "Magento_PageBuilder/js/component/stage/structural/options", "Magento_PageBuilder/js/component/stage/structural/options/option", "Magento_PageBuilder/js/component/stage/structural/options/title"], function (_knockout, _translate, _dismissibleConfirm, _underscore, _appearanceConfig, _string, _eventBus, _attributeFilter, _attributeMapper, _styleAttributeFilter, _styleAttributeMapper, _edit, _editableArea, _options, _option, _title) {
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
     * @param elementConverterPool
     * @param dataConverterPool
     */
    function Structural(parent, stage, config, elementConverterPool, dataConverterPool) {
      var _this;

      _this = _EditableArea.call(this, stage) || this;
      _this.config = void 0;
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
      _this.elementConverterPool = void 0;
      _this.dataConverterPool = void 0;

      _this.setChildren();

      _this.parent = parent;
      _this.config = config;
      _this.elementConverterPool = elementConverterPool;
      _this.dataConverterPool = dataConverterPool; // Create a new instance of edit for our editing needs

      _this.edit = new _edit(_this, _this.stage.store);

      _this.bindUpdatePreviewObservablesOnChange();

      return _this;
    }
    /**
     * Return an array of options
     *
     * @returns {Array<OptionInterface>}
     */


    var _proto = Structural.prototype;

    _proto.retrieveOptions = function retrieveOptions() {
      return [new _option.Option(this, "move", "<i class='icon-admin-pagebuilder-handle'></i>", (0, _translate)("Move"), null, ["move-structural"], 10), new _title.TitleOption(this, this.config.label, 20), new _option.Option(this, "edit", "<i class='icon-admin-pagebuilder-systems'></i>", (0, _translate)("Edit"), this.onOptionEdit, ["edit-block"], 30), new _option.Option(this, "duplicate", "<i class='icon-pagebuilder-copy'></i>", (0, _translate)("Duplicate"), this.onOptionDuplicate, ["duplicate-structural"], 40), new _option.Option(this, "remove", "<i class='icon-admin-pagebuilder-remove'></i>", (0, _translate)("Remove"), this.onOptionRemove, ["remove-structural"], 50)];
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

      var removeBlock = function removeBlock() {
        var params = {
          block: _this2,
          index: _this2.parent.children().indexOf(_this2),
          parent: _this2.parent
        };

        _eventBus.trigger("block:removed", params);

        _eventBus.trigger(_this2.config.name + ":block:removed", params);
      };

      if (this.isConfigured()) {
        (0, _dismissibleConfirm)({
          actions: {
            confirm: function confirm() {
              // Call the parent to remove the child element
              removeBlock();
            }
          },
          content: (0, _translate)("Are you sure you want to remove this item? The data within this item is not recoverable once removed."),
          // tslint:disable-line:max-line-length
          dismissKey: "pagebuilder_modal_dismissed",
          dismissible: true,
          title: (0, _translate)("Confirm Item Removal")
        });
      } else {
        removeBlock();
      }
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
      var data = _underscore.extend({}, this.stage.store.get(this.id), this.config);

      if (element === undefined) {
        if (typeof data.appearance !== "undefined" && typeof data.appearances !== "undefined" && typeof data.appearances[data.appearance] !== "undefined") {
          _underscore.extend(data, data.appearances[data.appearance]);
        }

        return this.styleAttributeMapper.toDom(this.styleAttributeFilter.filter(data));
      }

      var appearanceConfiguration = (0, _appearanceConfig)(this.config.name, data.appearance);
      var config = appearanceConfiguration.data_mapping.elements;
      data = this.convertData(data, appearanceConfiguration.data_mapping.converters);
      var result = {};

      if (config[element].style.length) {
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
      var data = _underscore.extend({}, this.stage.store.get(this.id), this.config);

      if (element === undefined) {
        if (undefined === data.appearance || !data.appearance) {
          data.appearance = undefined !== this.config.fields.appearance ? this.config.fields.appearance.default : "default";
        }

        return this.attributeMapper.toDom(this.attributeFilter.filter(data));
      }

      var appearanceConfiguration = (0, _appearanceConfig)(this.config.name, data.appearance);
      var config = appearanceConfiguration.data_mapping.elements;
      data = this.convertData(data, appearanceConfiguration.data_mapping.converters);
      var result = {};

      if (config[element].attributes.length) {
        result = this.convertAttributes(config[element], data, "master");
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

      if (undefined !== config.html.var) {
        result = this.convertHtml(config, data, "master");
      }

      return result;
    };
    /**
     * Get block data
     *
     * @param {string} element
     * @returns {DataObject}
     */


    _proto.getData = function getData(element) {
      var data = _underscore.extend({}, this.stage.store.get(this.id));

      if (undefined === element) {
        return data;
      }

      var appearanceConfiguration = (0, _appearanceConfig)(this.config.name, data.appearance);
      var config = appearanceConfiguration.data_mapping.elements;
      data = this.convertData(data, appearanceConfiguration.data_mapping.converters);
      var result = {};

      if (undefined !== config[element].tag.var) {
        result[config[element].tag.var] = data[config[element].tag.var];
      }

      return result;
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
     * Does the current instance have any children or values different from the default for it's type?
     *
     * @returns {boolean}
     */


    _proto.isConfigured = function isConfigured() {
      if (this.children().length > 0) {
        return true;
      }

      var data = this.getData();
      var hasDataChanges = false;

      _underscore.each(this.config.fields, function (field, key) {
        var fieldValue = data[key];

        if (!fieldValue) {
          fieldValue = "";
        } // Default values can only ever be strings


        if (_underscore.isObject(fieldValue)) {
          // Empty arrays as default values appear as empty strings
          if (_underscore.isArray(fieldValue) && fieldValue.length === 0) {
            fieldValue = "";
          } else {
            fieldValue = JSON.stringify(fieldValue);
          }
        }

        if (_underscore.isObject(field.default)) {
          if (JSON.stringify(field.default) !== fieldValue) {
            hasDataChanges = true;
          }
        } else if (field.default !== fieldValue) {
          hasDataChanges = true;
        }

        return;
      });

      return hasDataChanges;
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

      for (var _iterator = config.attributes, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var _attributeConfig = _ref;

        if (undefined !== _attributeConfig.persist && null !== _attributeConfig.persist && false === !!_attributeConfig.persist) {
          continue;
        }

        var value = data[_attributeConfig.var];
        var converter = "preview" === area && _attributeConfig.preview_converter ? _attributeConfig.preview_converter : _attributeConfig.converter;

        if (this.elementConverterPool.get(converter)) {
          value = this.elementConverterPool.get(converter).toDom(_attributeConfig.var, data);
        }

        result[_attributeConfig.name] = value;
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
        for (var _iterator2 = config.style, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
          var _ref2;

          if (_isArray2) {
            if (_i2 >= _iterator2.length) break;
            _ref2 = _iterator2[_i2++];
          } else {
            _i2 = _iterator2.next();
            if (_i2.done) break;
            _ref2 = _i2.value;
          }

          var _propertyConfig = _ref2;

          if (undefined !== _propertyConfig.persist && null !== _propertyConfig.persist && false === !!_propertyConfig.persist) {
            continue;
          }

          var value = "";

          if (!!_propertyConfig.static) {
            value = _propertyConfig.value;
          } else {
            value = data[_propertyConfig.var];
            var converter = "preview" === area && _propertyConfig.preview_converter ? _propertyConfig.preview_converter : _propertyConfig.converter;

            if (this.elementConverterPool.get(converter)) {
              value = this.elementConverterPool.get(converter).toDom(_propertyConfig.var, data);
            }
          }

          if (_typeof(value) === "object") {
            _underscore.extend(result, value);
          } else {
            result[(0, _string.fromSnakeToCamelCase)(_propertyConfig.name)] = value;
          }
        }
      }

      return result;
    };
    /**
     * Convert html property
     *
     * @param {object} config
     * @param {DataObject} data
     * @param {string} area
     * @returns {string}
     */


    _proto.convertHtml = function convertHtml(config, data, area) {
      var value = data[config.html.var];
      var converter = "preview" === area && config.html.preview_converter ? config.html.preview_converter : config.html.converter;

      if (this.elementConverterPool.get(converter)) {
        value = this.elementConverterPool.get(converter).toDom(config.html.var, data);
      }

      return value;
    };
    /**
     * Process data for elements before its converted to knockout format
     *
     * @param {Object} data
     * @param {Object} convertersConfig
     * @returns {Object}
     */


    _proto.convertData = function convertData(data, convertersConfig) {
      for (var _iterator3 = convertersConfig, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
        var _ref3;

        if (_isArray3) {
          if (_i3 >= _iterator3.length) break;
          _ref3 = _iterator3[_i3++];
        } else {
          _i3 = _iterator3.next();
          if (_i3.done) break;
          _ref3 = _i3.value;
        }

        var _converterConfig = _ref3;
        data = this.dataConverterPool.get(_converterConfig.component).toDom(data, _converterConfig.config);
      }

      return data;
    };
    /**
     * Update preview observables after data changed in data store
     *
     * @param {object} data
     */


    _proto.updatePreviewObservables = function updatePreviewObservables(data) {
      var _this3 = this;

      var appearance = data && data.appearance !== undefined ? data.appearance : undefined;
      var appearanceConfiguration = (0, _appearanceConfig)(this.config.name, appearance);

      if (undefined === appearanceConfiguration || undefined === appearanceConfiguration.data_mapping || undefined === appearanceConfiguration.data_mapping.elements) {
        return;
      }

      var config = appearanceConfiguration.data_mapping.elements;

      var _arr = Object.keys(config);

      for (var _i4 = 0; _i4 < _arr.length; _i4++) {
        var elementName = _arr[_i4];

        if (this.data[elementName] === undefined) {
          this.data[elementName] = {
            attributes: _knockout.observable({}),
            style: _knockout.observable({}),
            css: _knockout.observable({}),
            html: _knockout.observable({})
          };
        }

        data = this.convertData(data, appearanceConfiguration.data_mapping.converters);

        if (config[elementName].style !== undefined) {
          this.data[elementName].style(this.convertStyle(config[elementName], data, "preview"));
        }

        if (config[elementName].attributes !== undefined) {
          this.data[elementName].attributes(this.convertAttributes(config[elementName], data, "preview"));
        }

        if (config[elementName].html !== undefined) {
          this.data[elementName].html(this.convertHtml(config[elementName], data, "preview"));
        }

        if (config[elementName].css !== undefined && config[elementName].css.var in data) {
          (function () {
            var css = data[config[elementName].css.var];
            var newClasses = {};

            if (css.length > 0) {
              css.toString().split(" ").map(function (value, index) {
                return newClasses[value] = true;
              });
            }

            var _arr2 = Object.keys(_this3.data[elementName].css());

            for (var _i5 = 0; _i5 < _arr2.length; _i5++) {
              var className = _arr2[_i5];

              if (!(className in newClasses)) {
                newClasses[className] = false;
              }
            }

            _this3.data[elementName].css(newClasses);
          })();
        }

        if (config[elementName].tag !== undefined) {
          if (this.data[elementName][config[elementName].tag.var] === undefined) {
            this.data[elementName][config[elementName].tag.var] = _knockout.observable("");
          }

          this.data[elementName][config[elementName].tag.var](data[config[elementName].tag.var]);
        }
      }

      _eventBus.trigger("previewObservables:updated", {
        preview: this
      });
    };
    /**
     * Attach event to updating data in data store to update observables
     */


    _proto.bindUpdatePreviewObservablesOnChange = function bindUpdatePreviewObservablesOnChange() {
      var _this4 = this;

      this.stage.store.subscribe(function (data) {
        _this4.updatePreviewObservables(_underscore.extend({}, _this4.stage.store.get(_this4.id)));
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
