/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/config", "Magento_PageBuilder/js/utils/url"], function (_config, _url) {
  /**
   * Copyright 2018 Adobe
   * All Rights Reserved.
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
   * @api
   */

  function isDirectiveDataUrl(url) {
    return url.indexOf("data:" + mimeType) === 0;
  }
  /**
   * Convert a directive into our data URI
   *
   * @param {string} directive
   * @returns {string}
   * @api
   */


  function toDataUrl(directive) {
    return "data:" + mimeType + "," + encodeURIComponent(directive);
  }
  /**
   * Convert a URI to it's directive equivalent
   *
   * @param {string} url
   * @returns {string}
   * @api
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
   * @api
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
   * @api
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
   * @api
   */


  function removeQuotesInMediaDirectives(html) {
    if (!html) {
      return "";
    }

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
   * @api
   */


  function convertMediaDirectivesToUrls(html) {
    if (!html) {
      return "";
    }

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

  function isMagentoWidgetPlaceholderImage(img) {
    if (img.closest(".magento-widget")) {
        return true;
    }

    var base64 = typeof window !== "undefined" && window.Base64 ? window.Base64 : null;

    if (!base64 || !img.id) {
        return false;
    }

    try {
        return base64.idDecode(img.id).indexOf("{{widget") !== -1;
    } catch (e) {
        return false;
    }
  }

  /**
   * If the URL is under the configured media base, return a {{media url=...}} directive; otherwise null.
   *
   * @param {string} imageUrl
   * @param {string} mediaUrlConfig
   * @returns {string | null}
   */
  function tryConvertAbsoluteMediaUrlToDirective(imageUrl, mediaUrlConfig) {
    if (!imageUrl || !mediaUrlConfig) {
      return null;
    }

    var trimmed = imageUrl.trim();

    if (trimmed.indexOf("{{media") !== -1 || trimmed.indexOf("data:") === 0) {
      return null;
    }

    var mediaBase = (0, _url.convertUrlToPathIfOtherUrlIsOnlyAPath)(mediaUrlConfig, trimmed);
    var parts = trimmed.split(mediaBase);

    if (parts.length < 2 || parts[1] === undefined || parts[1] === "") {
      return null;
    }

    return "{{media url=" + parts[1] + "}}";
  }
  /**
   * Replace absolute media URLs in img[src] with {{media url=...}} directives for datastore persistence.
   *
   * @param {string} html
   * @returns {string}
   * @api
   */


  function convertMediaUrlsToDirectives(html) {
    if (!html) {
      return "";
    }

    var mediaUrlConfig = _config.getConfig("media_url");

    if (!mediaUrlConfig) {
      return html;
    }

    var doc = new DOMParser().parseFromString(html, "text/html");

    if (!doc.body) {
      return html;
    }

    var updated = false;
    var images = doc.body.querySelectorAll("img[src]");
    images.forEach(function (img) {
      var src = img.getAttribute("src");

      if (!src) {
        return;
      }

      if (isMagentoWidgetPlaceholderImage(img)) {
          return;
      }

      var directive = tryConvertAbsoluteMediaUrlToDirective(src, mediaUrlConfig);

      if (directive !== null) {
        img.setAttribute("src", directive);
        updated = true;
      }
    });
    return updated ? doc.body.innerHTML : html;
  }
  /**
   * Replace data-src attribute with src.
   *
   * @param {string} html
   * @returns {string}
   */


  function replaceWithSrc(html) {
    return html.replace(new RegExp("data-tmp-src=\"\{\{", "g"), "src=\"{{");
  }
  /**
   * Replace src attribute with data-tmp-src.
   *
   * @param {string} html
   * @returns {string}
   */


  function replaceWithDataSrc(html) {
    return html.replace(new RegExp("src=\"\{\{", "g"), "data-tmp-src=\"{{");
  }

  return Object.assign(decodeAllDataUrlsInString, {
    toDataUrl: toDataUrl,
    fromDataUrl: fromDataUrl,
    getImageUrl: getImageUrl,
    removeQuotesInMediaDirectives: removeQuotesInMediaDirectives,
    convertMediaDirectivesToUrls: convertMediaDirectivesToUrls,
    convertMediaUrlsToDirectives: convertMediaUrlsToDirectives,
    replaceWithSrc: replaceWithSrc,
    replaceWithDataSrc: replaceWithDataSrc
  });
});

//# sourceMappingURL=directives.js.map
