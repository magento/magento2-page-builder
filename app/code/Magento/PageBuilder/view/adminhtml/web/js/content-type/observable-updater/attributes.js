/*eslint-disable */
/* jscs:disable */

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

    var _loop = function _loop() {
      var attributeConfig = _step.value;

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

    for (var _iterator = _createForOfIteratorHelperLoose(config.attributes), _step; !(_step = _iterator()).done;) {
      var _ret = _loop();

      if (_ret === "continue") continue;
    }

    attributeData["data-element"] = elementName;
    return attributeData;
  }

  return generate;
});
//# sourceMappingURL=attributes.js.map