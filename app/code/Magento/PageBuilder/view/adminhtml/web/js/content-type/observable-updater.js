/*eslint-disable */
/* jscs:disable */
define(["consoleLogger", "knockout", "underscore", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type/appearance-config", "Magento_PageBuilder/js/content-type/observable-updater/attributes", "Magento_PageBuilder/js/content-type/observable-updater/css", "Magento_PageBuilder/js/content-type/observable-updater/html", "Magento_PageBuilder/js/content-type/observable-updater/style"], function (_consoleLogger, _knockout, _underscore, _config, _appearanceConfig, _attributes, _css, _html, _style) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ObservableUpdater =
  /*#__PURE__*/
  function () {
    "use strict";

    /**
     * @param {typeof ConverterPool} converterPool
     * @param {typeof MassConverterPool} massConverterPool
     * @param {(config: object) => string} converterResolver
     */
    function ObservableUpdater(converterPool, massConverterPool, converterResolver) {
      this.previousData = {};
      this.bindingGenerators = {
        attributes: _attributes,
        css: _css,
        html: _html,
        style: _style
      };
      this.converterPool = converterPool;
      this.massConverterPool = massConverterPool;
      this.converterResolver = converterResolver;
    }
    /**
     * Update the associated viewModel with the generated data
     *
     * We create an API for each potential binding and make it available in the master and preview templates through
     * the data variable. Each data variable will have associated observables that are updated on a data change.
     *
     * @param {Preview} viewModel
     * @param {DataObject} data
     * @param {DataObject} dataStores
     */


    var _proto = ObservableUpdater.prototype;

    _proto.update = function update(viewModel, data, dataStores) {
      var appearance = data && data.appearance !== undefined ? data.appearance : undefined;
      var appearanceConfiguration = (0, _appearanceConfig)(viewModel.contentType.config.name, appearance);

      if (undefined === appearanceConfiguration || undefined === appearanceConfiguration.elements) {
        return;
      } // Generate Knockout bindings in objects for usage in preview and master templates


      var generatedBindings = this.generateKnockoutBindings(appearanceConfiguration.elements, appearanceConfiguration.converters, data, dataStores);

      var _loop = function _loop(element) {
        if (generatedBindings.hasOwnProperty(element)) {
          // Ensure every element is represented by an object
          if (viewModel.data[element] === undefined) {
            viewModel.data[element] = {};
          }
          /**
           * Iterate through each elements data (css, style, attributes) and apply data updates within the
           * observable. If no observable already exists create a new one.
           */


          Object.keys(generatedBindings[element]).forEach(function (key) {
            var elementBindings = viewModel.data[element][key];

            if (elementBindings !== undefined && _knockout.isObservable(elementBindings)) {
              elementBindings(generatedBindings[element][key]);
            } else {
              viewModel.data[element][key] = _knockout.observable(generatedBindings[element][key]);
            }
          });
        }
      };

      for (var element in generatedBindings) {
        _loop(element);
      }
    }
    /**
     * Generate binding object to be applied to master format
     *
     * This function iterates through each element defined in the content types XML and generates a nested object of
     * the associated Knockout binding data. We support 5 bindings attributes, style, css, html & tag.
     *
     * @param elements
     * @param converters
     * @param data
     * @param dataStoreStates
     */
    ;

    _proto.generateKnockoutBindings = function generateKnockoutBindings(elements, converters, data, dataStoreStates) {
      var convertedData = this.convertData(data, converters);
      var generatedData = {};

      for (var _i = 0, _Object$keys = Object.keys(elements); _i < _Object$keys.length; _i++) {
        var elementName = _Object$keys[_i];
        var elementConfig = elements[elementName];

        if (this.previousData[elementName] === undefined) {
          this.previousData[elementName] = {};
        }

        generatedData[elementName] = {
          attributes: this.generateKnockoutBinding("attributes", elementName, elementConfig, data),
          style: _config.getMode() === "Preview" ? this.generateKnockoutBinding("style", elementName, elementConfig, data) : this.generateKnockoutBindingForBreakpoints("style", elementName, elementConfig, data, dataStoreStates),
          css: elementConfig.css.var in convertedData ? this.generateKnockoutBinding("css", elementName, elementConfig, data) : {},
          html: this.generateKnockoutBinding("html", elementName, elementConfig, data)
        };

        if (elementConfig.tag !== undefined && elementConfig.tag.var !== undefined) {
          if (generatedData[elementName][elementConfig.tag.var] === undefined) {
            generatedData[elementName][elementConfig.tag.var] = "";
          }

          generatedData[elementName][elementConfig.tag.var] = convertedData[elementConfig.tag.var];
        }
      }

      return generatedData;
    }
    /**
     * Process data for elements before its converted to knockout format
     *
     * @param {object} data
     * @param {ConverterInterface[]} convertersConfig
     * @returns {object}
     */
    ;

    _proto.convertData = function convertData(data, convertersConfig) {
      for (var _iterator = convertersConfig, _isArray = Array.isArray(_iterator), _i2 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i2 >= _iterator.length) break;
          _ref = _iterator[_i2++];
        } else {
          _i2 = _iterator.next();
          if (_i2.done) break;
          _ref = _i2.value;
        }

        var converterConfig = _ref;
        this.massConverterPool.get(converterConfig.component).toDom(data, converterConfig.config);
      }

      return data;
    }
    /**
     * Generate an individual knockout binding
     *
     * @param binding
     * @param elementName
     * @param config
     * @param data
     */
    ;

    _proto.generateKnockoutBinding = function generateKnockoutBinding(binding, elementName, config, data) {
      if (config[binding] === undefined) {
        return {};
      }

      var previousData = {};

      if (this.previousData[elementName][binding] !== undefined) {
        previousData = this.previousData[elementName][binding];
      }

      if (this.bindingGenerators[binding] === undefined) {
        _consoleLogger.error("Unable to find Knockout binding generator for " + binding);

        return {};
      } // Generate the associated binding using our dedicated generators


      var generatedBindingData = this.bindingGenerators[binding](elementName, config, data, this.converterResolver, this.converterPool, previousData);
      this.previousData[elementName][binding] = generatedBindingData;
      return generatedBindingData;
    }
    /**
     * Generate an individual knockout binding for breakpoints
     *
     * @param binding
     * @param elementName
     * @param config
     * @param data
     * @param dataStoreStates
     */
    ;

    _proto.generateKnockoutBindingForBreakpoints = function generateKnockoutBindingForBreakpoints(binding, elementName, config, data, dataStoreStates) {
      var _this = this;

      var result = {};
      Object.keys(dataStoreStates).forEach(function (name) {
        result[name] = _underscore.isEmpty(dataStoreStates[name]) ? {} : _this.generateKnockoutBinding(binding, elementName, config, dataStoreStates[name]);
      });
      return result;
    };

    return ObservableUpdater;
  }();

  return ObservableUpdater;
});
//# sourceMappingURL=observable-updater.js.map