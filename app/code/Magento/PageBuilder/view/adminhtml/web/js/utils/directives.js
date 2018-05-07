/*eslint-disable */
define(["Magento_PageBuilder/js/component/config"], function (_config) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * MIME type to use in place of the image
   *
   * @type {string}
   */
  var mimeType = "text/magento-directive";
  /**
   * Determine if a URL is a directive of our type
   *
   * @param {string} url
   * @returns {boolean}
   */

  function isDirectiveDataUrl(url) {
    return url.indexOf("data:" + mimeType) === 0;
  }
  /**
   * Convert a directive into our data URI
   *
   * @param {string} directive
   * @returns {string}
   */


  function toDataUrl(directive) {
    return "data:" + mimeType + "," + encodeURIComponent(directive);
  }
  /**
   * Convert a URI to it's directive equivalent
   *
   * @param {string} url
   * @returns {string}
   */


  function fromDataUrl(url) {
    if (!isDirectiveDataUrl(url)) {
      throw Error(url + " is not a magento directive data url");
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
    return str.replace(new RegExp("url\\s*\\(\\s*(?:&quot;|\'|\")?(data:" + mimeType + ",.+?)(?:&quot;|\'|\")?\\s*\\)", "g"), function (match, url) {
      return "url(\'" + fromDataUrl(url) + "\')";
    });
  }
  /**
   * Retrieve the image URL with directive
   *
   * @param {Array} image
   * @returns {string}
   */


  function getImageUrl(image) {
    var imageUrl = image[0].url;
    var mediaPath = imageUrl.split(_config.getConfig("media_url"));
    return "{{media url=" + mediaPath[1] + "}}";
  }
  /**
   * Remove quotes in media directives, {{media url="wysiwyg/image.png"}} convert to {{media url=wysiwyg/image.png}}
   *
   * @param {string} html
   * @returns {string}
   */


  function removeQuotesInMediaDirectives(html) {
    var mediaDirectiveRegExp = /\{\{\s*media\s+url\s*=\s*(.*?)\s*\}\}/g;
    var urlRegExp = /\{\{\s*media\s+url\s*=\s*(.*)\s*\}\}/;
    var mediaDirectiveMatches = html.match(mediaDirectiveRegExp);

    if (mediaDirectiveMatches) {
      mediaDirectiveMatches.forEach(function (mediaDirective) {
        var urlMatches = mediaDirective.match(urlRegExp);

        if (urlMatches && urlMatches[1] !== undefined) {
          var directiveWithOutQuotes = "{{media url=" + urlMatches[1].replace(/("|&quot;|\s)/g, "") + "}}";
          html = html.replace(mediaDirective, directiveWithOutQuotes);
        }
      });
    }

    return html;
  }
  /**
   * Replace media directives with actual media URLs
   *
   * @param {string} html
   * @returns {string}
   */


  function convertMediaDirectivesToUrls(html) {
    var mediaDirectiveRegExp = /\{\{\s*media\s+url\s*=\s*"?[^"\s\}]+"?\s*\}\}/g;
    var mediaDirectiveMatches = html.match(mediaDirectiveRegExp);

    if (mediaDirectiveMatches) {
      mediaDirectiveMatches.forEach(function (mediaDirective) {
        var urlRegExp = /\{\{\s*media\s+url\s*=\s*(?:"|&quot;)?(.+)(?=}})\s*\}\}/;
        var urlMatches = mediaDirective.match(urlRegExp);

        if (urlMatches && typeof urlMatches[1] !== "undefined") {
          html = html.replace(mediaDirective, _config.getConfig("media_url") + urlMatches[1].replace(/"$/, "").replace(/&quot;$/, ""));
        }
      });
    }

    return html;
  }

  return Object.assign(decodeAllDataUrlsInString, {
    toDataUrl: toDataUrl,
    fromDataUrl: fromDataUrl,
    getImageUrl: getImageUrl,
    removeQuotesInMediaDirectives: removeQuotesInMediaDirectives,
    convertMediaDirectivesToUrls: convertMediaDirectivesToUrls
  });
});
//# sourceMappingURL=directives.js.map
