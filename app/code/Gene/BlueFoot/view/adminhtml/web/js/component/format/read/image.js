define(["../../../component/config"], function (_config) {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Image =
  /*#__PURE__*/
  function () {
    function Image() {}

    var _proto = Image.prototype;

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      return Promise.resolve({
        'image': this.generateImageObject(element.querySelector('img:nth-child(1)').getAttribute('src')),
        'mobile_image': this.generateImageObject(element.querySelector('img:nth-child(2)').getAttribute('src')),
        'alt': element.querySelector('img:nth-child(1)').getAttribute('alt'),
        'title_tag': element.querySelector('a').getAttribute('title'),
        'lightbox': !!element.querySelector('a.bluefoot-lightbox') ? "Yes" : "No",
        'show_caption': !!element.querySelector('figcaption') ? "Yes" : "No"
      });
    };
    /**
     * Generate the image object
     *
     * @param {string} src
     * @returns {ImageObject}
     */


    _proto.generateImageObject = function generateImageObject(src) {
      if (!src) {
        // Has to return an empty string for the image UI component
        return "";
      } // Match the URL & type from the directive


      var _$exec = /{{.*\s*url="?(.*\.([a-z|A-Z]*))"?\s*}}/.exec(decodeURIComponent(src)),
          url = _$exec[1],
          type = _$exec[2];

      return [{
        "name": url.split('/').pop(),
        "size": 0,
        "type": "image/" + type,
        "url": _config.getInitConfig('media_url') + url
      }];
    };

    return Image;
  }();

  return Image;
});
//# sourceMappingURL=image.js.map
