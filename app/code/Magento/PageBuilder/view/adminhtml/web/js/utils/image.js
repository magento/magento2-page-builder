/*eslint-disable */
define(["Magento_PageBuilder/js/config"], function (_config) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Decode image background URL to object
   *
   * @param value
   * @returns {Object}
   * @api
   */
  function decodeUrl(value) {
    var result = "";
    value = decodeURIComponent(value.replace(window.location.href, ""));
    var regexp = /{{.*\s*url="?(.*\.([a-z|A-Z]*))"?.*?}}/;

    if (regexp.test(value)) {
      var _regexp$exec = regexp.exec(value),
          url = _regexp$exec[1],
          type = _regexp$exec[2],
          image = {
            name: url.split("/").pop(),
            size: 0,
            type: "image/" + type,
            url: _config.getConfig("media_url") + url
          },
          imageIdMatch = value.match(/{{.*\s*id\s*="?([a-zA-Z0-9-]*)"?\s*}}/);

      if (imageIdMatch) {
        image.id = imageIdMatch[1];
      }

      result = [image];
    }

    return result;
  }

  return {
    decodeUrl: decodeUrl
  };
});
//# sourceMappingURL=image.js.map
