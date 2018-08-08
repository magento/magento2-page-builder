/*eslint-disable */
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
   * @param {String} fieldName The ket in the provided datastore to set the data.
   * @returns {Wysiwyg}
   * @api
   */
  function create(contentTypeId, elementId, contentTypeName, config, dataStore, fieldName) {
    config = _jquery.extend(true, {}, config);
    return new Promise(function (resolve) {
      (0, _loader)([config.additional.component], function (WysiwygInstance) {
        new Promise(function (configResolve) {
          if (config.additional.initializers && config.additional.initializers.config && config.additional.initializers.config[contentTypeName]) {
            (0, _loader)([config.additional.initializers.config[contentTypeName]], function (InitializerInstance) {
              var initializer = new InitializerInstance(); // Allow dynamic settings to be set before editor is initialized

              initializer.initializeConfig(contentTypeId, config);
              configResolve();
            });
          } else {
            configResolve();
          }
        }).then(function () {
          // Instantiate the component
          var wysiwyg = new WysiwygInstance(contentTypeId, elementId, contentTypeName, config, dataStore, fieldName);

          if (config.additional.initializers && config.additional.initializers.component && config.additional.initializers.component[contentTypeName]) {
            (0, _loader)([config.additional.initializers.component[contentTypeName]], function (InitializerInstance) {
              var initializer = new InitializerInstance(); // Allow dynamic bindings from configuration such as events from the editor

              initializer.initializeComponent(wysiwyg);
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
