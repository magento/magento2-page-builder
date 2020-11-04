/*eslint-disable */
/* jscs:disable */
define(["underscore", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/utils/object"], function (_underscore, _config, _object) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Generate Knockout compatible bindings for the elements attribute binding
   *
   * @param elementName
   * @param config
   * @param data
   * @param converterResolver
   * @param converterPool
   */
  function generate(elementName, config, data, converterResolver, converterPool) {
    var attributeData = {};

    var _loop2 = function _loop2() {
      if (_isArray) {
        if (_i >= _iterator.length) return "break";
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) return "break";
        _ref = _i.value;
      }

      var attributeConfig = _ref;

      if ("read" === attributeConfig.persistence_mode) {
        return "continue";
      } // @ts-ignore


      var value = void 0;

      if (!!attributeConfig.static) {
        value = attributeConfig.value;
      } else {
        value = (0, _object.get)(data, attributeConfig.var);
      }

      var converter = converterResolver(attributeConfig);

      if (converterPool.get(converter)) {
        value = converterPool.get(converter).toDom(attributeConfig.var, data);
      } // Replacing src attribute with data-tmp-src to prevent img requests in iframe during master format rendering


      if (_config.getMode() !== "Preview" && attributeConfig.name === "src" && _underscore.isString(value) && !value.indexOf("{{media url=")) {
        attributeData["data-tmp-" + attributeConfig.name] = value; // @ts-ignore

        Object.defineProperty(attributeData, attributeConfig.name, {
          get: function get() {
            return value;
          }
        });
      } else {
        attributeData[attributeConfig.name] = value;
      }
    };

    _loop: for (var _iterator = config.attributes, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      var _ret = _loop2();

      switch (_ret) {
        case "break":
          break _loop;

        case "continue":
          continue;
      }
    }

    attributeData["data-element"] = elementName;
    return attributeData;
  }

  return generate;
});
//# sourceMappingURL=attributes.js.map