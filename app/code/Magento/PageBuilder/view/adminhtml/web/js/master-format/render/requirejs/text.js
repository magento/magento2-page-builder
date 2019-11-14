/*eslint-disable */
/* jscs:disable */
define(["mage/requirejs/text", "Magento_PageBuilder/js/master-format/render/frame"], function (_text, _frame) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Within our render frame we override the RequireJS text! plugin, this is originally implemented within
   * lib/web/mage/requirejs/text.js. The override uses the MessageChannel to communicate with the parent frame to
   * retrieve any requested HTML knockout template. We do this due to the sandbox restrictions on the iframe disallow
   * XHR requests to the same origin domain.
   */

  /**
   * Load a template
   *
   * @param name
   * @param req
   * @param onLoad
   */
  function load(name, req, onLoad) {
    (0, _frame.loadTemplate)(name).then(function (template) {
      onLoad(template);
    }).catch(function (error) {
      onLoad.error(error);
    });
  }
  /**
   * Retrieve a template
   *
   * @param url
   * @param callback
   * @param fail
   * @param headers
   */


  function get(url, callback, fail, headers) {
    _text.get.apply(_text, arguments);
  }

  return {
    load: load,
    get: get
  };
});
//# sourceMappingURL=text.js.map