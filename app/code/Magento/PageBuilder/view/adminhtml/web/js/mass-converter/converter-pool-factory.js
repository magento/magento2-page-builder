/*eslint-disable */
/* jscs:disable */

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

define(["Magento_PageBuilder/js/config", "Magento_PageBuilder/js/utils/loader", "Magento_PageBuilder/js/mass-converter/converter-pool"], function (_config, _loader, _converterPool) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Create a new instance of converter pool
   */
  function create(contentType) {
    var config = _config.getContentTypeConfig(contentType);

    var converters = [];
    var appearanceName;

    for (var _i = 0, _Object$keys = Object.keys(config.appearances); _i < _Object$keys.length; _i++) {
      appearanceName = _Object$keys[_i];
      var appearance = config.appearances[appearanceName];

      if (undefined !== appearance && undefined !== appearance.converters) {
        for (var _iterator = _createForOfIteratorHelperLoose(appearance.converters), _step; !(_step = _iterator()).done;) {
          var converterConfig = _step.value;

          if (!!converterConfig.component && !_converterPool.get(converterConfig.component)) {
            converters.push(converterConfig.component);
          }
        }
      }
    }

    return new Promise(function (resolve) {
      (0, _loader)(converters, function () {
        for (var _len = arguments.length, loadedConverters = new Array(_len), _key = 0; _key < _len; _key++) {
          loadedConverters[_key] = arguments[_key];
        }

        for (var i = 0; i < converters.length; i++) {
          _converterPool.register(converters[i], new loadedConverters[i]());
        }

        resolve(_converterPool);
      });
    });
  }

  return create;
});
//# sourceMappingURL=converter-pool-factory.js.map