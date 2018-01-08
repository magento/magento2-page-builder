/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * MIME type to use in place of the image
   * @type {string}
   */
  var mimeType = 'text/magento-directive';
  /**
   * Determine if a URL is a directive of our type
   *
   * @param {string} url
   * @returns {boolean}
   */

  function isDirectiveDataUrl(url) {
    return url.indexOf('data:' + mimeType) === 0;
  }
  /**
   * Convert a directive into our data URI
   * @param {string} directive
   * @returns {string}
   */


  function toDataUrl(directive) {
    return 'data:' + mimeType + ',' + encodeURIComponent(directive);
  }
  /**
   * Convert a URI to it's directive equivalent
   * @param {string} url
   * @returns {string}
   */


  function fromDataUrl(url) {
    if (!isDirectiveDataUrl(url)) {
      throw Error(url + ' is not a magento directive data url');
    }

    return decodeURIComponent(url.split(mimeType + ",")[1]);
  }
  /**
   * Decode all data URIs present in a string
   *
   * @param {string} str
   * @returns {string}
   */


  function decodeAllDataUrlsInString(str) {
    return str.replace(new RegExp('url\\s*\\(\\s*(?:&quot;|\'|")?(data:' + mimeType + ',.+?)(?:&quot;|\'|")?\\s*\\)', 'g'), function (match, url) {
      return 'url(\'' + fromDataUrl(url) + '\')';
    });
  }

  return Object.assign(decodeAllDataUrlsInString, {
    toDataUrl: toDataUrl,
    fromDataUrl: fromDataUrl
  });
});
//# sourceMappingURL=directives.js.map
