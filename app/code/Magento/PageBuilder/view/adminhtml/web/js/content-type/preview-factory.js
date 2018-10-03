/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

define(["Magento_PageBuilder/js/utils/loader", "Magento_PageBuilder/js/content-type/observable-updater-factory", "Magento_PageBuilder/js/content-type/preview-converter-resolver"], function (_loader, _observableUpdaterFactory, _previewConverterResolver) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Create new preview instance
   *
   * @param {ContentTypeInterface} contentType
   * @param {ContentTypeConfigInterface} config
   * @returns {Promise<ContentTypeInterface>}
   */
  function create(contentType, config) {
    return new Promise(function (resolve) {
      (0, _observableUpdaterFactory)(config, _previewConverterResolver).then(function (observableUpdater) {
        (0, _loader)([config.preview_component], function (previewComponent) {
          resolve(new previewComponent(contentType, config, observableUpdater));
        });
      }).catch(function (error) {
        console.error(error);
      });
    });
  }

  return _extends(create, {
    __esModule: true
  });
});
//# sourceMappingURL=preview-factory.js.map
