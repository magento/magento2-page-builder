/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/config", "Magento_PageBuilder/js/utils/directives", "Magento_PageBuilder/js/utils/editor", "Magento_PageBuilder/js/utils/object"], function (_config, _directives, _editor, _object) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Generate Knockout compatible bindings for the elements html binding
   *
   * @param elementName
   * @param config
   * @param data
   * @param converterResolver
   * @param converterPool
   */
  function generate(elementName, config, data, converterResolver, converterPool) {
    var value = config.html.var ? (0, _object.get)(data, config.html.var, config.html.placeholder) : config.html.placeholder;
    var converter = converterResolver(config.html);

    if (converterPool.get(converter)) {
      value = converterPool.get(converter).toDom(config.html.var, data);
    } // if value is empty, use placeholder


    if (typeof value === "string" && !value.length && config.html.placeholder) {
      value = config.html.placeholder;
    } // Replacing src attribute with data-tmp-src to prevent img requests in iframe during master format rendering


    if (_config.getMode() !== "Preview" && typeof value === "string" && value.indexOf("{{media url=") !== -1) {
      value = (0, _directives.replaceWithDataSrc)(value);
    } // Process all desktop styles that left unprocessed after migrating from inline styles.


    if (typeof value === "string") {
      value = (0, _editor.processInlineStyles)(value);
    }

    return value;
  }

  return generate;
});
//# sourceMappingURL=html.js.map