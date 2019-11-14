/*eslint-disable */
/* jscs:disable */
define(["jquery", "Magento_PageBuilder/js/utils/loader"], function (_jquery, _loader) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @param {String} contentTypeId The ID in the registry of the content type.
   * @param {String} elementId The ID of the editor element in the DOM.
   * @param {String} contentTypeName The type of content type this editor will be used in. E.g. "banner".
   * @param {AdditionalDataConfigInterface} config The configuration for the wysiwyg.
   * @param {DataStore} dataStore The datastore to store the content in.
   * @param {String} fieldName The key in the provided datastore to set the data.
   * @param {String} stageId The ID in the registry of the stage containing the content type.
   * @returns {Wysiwyg}
   */
  function create(contentTypeId, elementId, contentTypeName, config, dataStore, fieldName, stageId) {
    config = _jquery.extend(true, {}, config);
    return new Promise(function (resolve) {
      (0, _loader)([config.adapter_config.component], function (WysiwygInstance) {
        new Promise(function (configResolve) {
          if (config.adapter_config.config_modifiers && config.adapter_config.config_modifiers[contentTypeName]) {
            (0, _loader)([config.adapter_config.config_modifiers[contentTypeName]], function (ConfigModifierType) {
              var modifier = new ConfigModifierType(); // Allow dynamic settings to be set before editor is initialized

              modifier.modify(contentTypeId, config);
              configResolve();
            });
          } else {
            configResolve();
          }
        }).then(function () {
          // Instantiate the component
          var wysiwyg = new WysiwygInstance(contentTypeId, elementId, config, dataStore, fieldName, stageId);

          if (config.adapter_config.component_initializers && config.adapter_config.component_initializers[contentTypeName]) {
            (0, _loader)([config.adapter_config.component_initializers[contentTypeName]], function (InitializerType) {
              var initializer = new InitializerType(); // Allow dynamic bindings from configuration such as events from the editor

              initializer.initialize(wysiwyg);
              resolve(wysiwyg);
            });
          } else {
            resolve(wysiwyg);
          }
        });
      });
    });
  }

  return create;
});
//# sourceMappingURL=factory.js.map