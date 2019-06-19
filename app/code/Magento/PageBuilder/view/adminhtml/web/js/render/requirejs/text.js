/*eslint-disable */
define(["mage/requirejs/text", "Magento_PageBuilder/js/render/frame"], function (_text, _frame) {
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