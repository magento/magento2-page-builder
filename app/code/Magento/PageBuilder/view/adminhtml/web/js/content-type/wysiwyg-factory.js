/*eslint-disable */
define(["mage/adminhtml/wysiwyg/tiny_mce/setup"], function (_setup) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Create new wysiwyg adapter instance
   * @param {string} elementId
   * @param {object} config
   * @returns {WysiwygSetup}
   * @api
   */
  function create(elementId, config) {
    var wysiwygSetup = new _setup(elementId, config.adapter);

    if (config.additional.mode) {
      wysiwygSetup.setup(config.additional.mode);
    }

    return wysiwygSetup.wysiwygInstance;
  }

  return create;
});
//# sourceMappingURL=wysiwyg-factory.js.map
