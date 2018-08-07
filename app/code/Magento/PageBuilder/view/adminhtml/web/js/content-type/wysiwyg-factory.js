/*eslint-disable */
define(["jquery", "Magento_PageBuilder/js/utils/loader"], function (_jquery, _loader) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   *
   * @param {string} contentTypeId
   * @param {string} elementId
   * @param {String} contentTypeName
   * @param {AdditionalDataConfigInterface} config
   * @param {DataStore} dataStore
   * @returns {Wysiwyg}
   * @api
   */
  function create(contentTypeId, elementId, contentTypeName, config, dataStore) {
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
          var wysiwyg = new WysiwygInstance(contentTypeId, elementId, contentTypeName, config, dataStore);

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
//# sourceMappingURL=wysiwyg-factory.js.map
