/*eslint-disable */
/* jscs:disable */

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
      for (var _iterator = _createForOfIteratorHelperLoose(config.style), _step; !(_step = _iterator()).done;) {
        var propertyConfig = _step.value;

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