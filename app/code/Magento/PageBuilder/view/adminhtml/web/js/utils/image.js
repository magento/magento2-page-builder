/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/config", "Magento_PageBuilder/js/utils/directives", "Magento_PageBuilder/js/utils/url"], function (_config, _directives, _url) {
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
    var regexp = /{{.*\s*url="?(.*\.([a-z|A-Z]*))"?\s*}}/;

    if (regexp.test(value)) {
      var _regexp$exec = regexp.exec(value),
          url = _regexp$exec[1],
          type = _regexp$exec[2];

      var image = {
        name: url.split("/").pop(),
        size: 0,
        type: "image/" + type,
        url: _config.getConfig("media_url") + url
      };
      result = [image];
    }

    return result;
  }
  /**
   * Convert a URL to an image directive
   *
   * @param {string} imageUrl
   * @returns {string}
   */


  function urlToDirective(imageUrl) {
    var mediaUrl = (0, _url.convertUrlToPathIfOtherUrlIsOnlyAPath)(_config.getConfig("media_url"), imageUrl);
    var mediaPath = imageUrl.split(mediaUrl);
    return "{{media url=" + mediaPath[1] + "}}";
  }
  /**
   * Convert an image URL to a background image data uri
   *
   * @param {string} imageUrl
   * @returns {string}
   */


  function imageToBackgroundImageDataUrl(imageUrl) {
    return "url(\'" + (0, _directives.toDataUrl)(urlToDirective(imageUrl)) + "\')";
  }

  return {
    decodeUrl: decodeUrl,
    urlToDirective: urlToDirective,
    imageToBackgroundImageDataUrl: imageToBackgroundImageDataUrl
  };
});
//# sourceMappingURL=image.js.map