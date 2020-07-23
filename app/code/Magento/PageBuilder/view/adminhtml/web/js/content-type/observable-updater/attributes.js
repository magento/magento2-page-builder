/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/utils/object"], function (_object) {
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

      var attributeConfig = _ref;

      if ("read" === attributeConfig.persistence_mode) {
        continue;
      }

      var value = void 0;

      if (!!attributeConfig.static) {
        value = attributeConfig.value;
      } else {
        value = (0, _object.get)(data, attributeConfig.var);
      }

      var converter = converterResolver(attributeConfig);

      if (converterPool.get(converter)) {
        value = converterPool.get(converter).toDom(attributeConfig.var, data);
      }

      attributeData[attributeConfig.name] = value;
    }

    attributeData["data-element"] = elementName;
    return attributeData;
  }

  return generate;
});
//# sourceMappingURL=attributes.js.map