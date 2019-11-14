/*eslint-disable */
/* jscs:disable */
define(["underscore", "Magento_PageBuilder/js/utils/object", "Magento_PageBuilder/js/utils/string"], function (_underscore, _object, _string) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Generate Knockout compatible bindings for the elements style binding
   *
   * @param elementName
   * @param config
   * @param data
   * @param converterResolver
   * @param converterPool
   * @param previousData
   */
  function generate(elementName, config, data, converterResolver, converterPool, previousData) {
    var newStyles = {};

    if (config.style) {
      for (var _iterator = config.style, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var propertyConfig = _ref;

        if ("read" === propertyConfig.persistence_mode) {
          continue;
        }

        var value = void 0;

        if (!!propertyConfig.static) {
          value = propertyConfig.value;
        } else {
          value = (0, _object.get)(data, propertyConfig.var);
          var converter = converterResolver(propertyConfig);

          if (converterPool.get(converter)) {
            value = converterPool.get(converter).toDom(propertyConfig.var, data);
          }
        }

        if (typeof value === "object") {
          _underscore.extend(newStyles, value);
        } else if (value !== undefined) {
          newStyles[(0, _string.fromSnakeToCamelCase)(propertyConfig.name)] = value;
        }
      }
    }

    if (previousData) {
      /**
       * If so we need to retrieve the previous styles applied to this element and create a new object
       * which forces all of these styles to be "false". Knockout doesn't clean existing styles when
       * applying new styles to an element. This resolves styles sticking around when they should be
       * removed.
       */
      var removeCurrentStyles = Object.keys(previousData).reduce(function (object, styleName) {
        var _Object$assign;

        return Object.assign(object, (_Object$assign = {}, _Object$assign[styleName] = "", _Object$assign));
      }, {});

      if (!_underscore.isEmpty(removeCurrentStyles)) {
        newStyles = _underscore.extend(removeCurrentStyles, newStyles);
      }
    }

    return newStyles;
  }

  return generate;
});
//# sourceMappingURL=style.js.map