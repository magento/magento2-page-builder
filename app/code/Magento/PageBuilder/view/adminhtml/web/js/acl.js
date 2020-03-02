/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/config"], function (_config) {
  var resources = {
    TEMPLATE_SAVE: "template_save",
    TEMPLATE_APPLY: "template_apply"
  };
  /**
   * Determine if the current user is allowed to access this resource
   *
   * Usage: isAllowed(resources.TEMPLATE_SAVE)
   *
   * @param resource
   */

  function isAllowed(resource) {
    return _config.getConfig("acl")[resource] === true;
  }

  return {
    isAllowed: isAllowed,
    resources: resources
  };
});
//# sourceMappingURL=acl.js.map