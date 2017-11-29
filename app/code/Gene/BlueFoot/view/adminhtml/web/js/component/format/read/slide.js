define(["../../../component/config"], function (_config) {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Slide =
  /*#__PURE__*/
  function () {
    function Slide() {}

    var _proto = Slide.prototype;

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      var target = element.querySelector('a').getAttribute('target'),
          response = {
        'image': this.generateImageObject(element.querySelector('img:nth-child(1)').getAttribute('src')),
        'mobile_image': "",
        'alt': element.querySelector('img:nth-child(1)').getAttribute('alt'),
        'title_tag': element.querySelector('a').getAttribute('title'),
        'link_text': element.querySelector('a>div') === null ? "" : element.querySelector('a>div').innerHTML,
        'link_url': element.querySelector('a').getAttribute('href'),
        'open_in_new_window': target && target == '_blank' ? "1" : "0"
      }; // Detect if there is a mobile image and update the response

      if (element.querySelector('img:nth-child(2)') && element.querySelector('img:nth-child(2)').getAttribute('src')) {
        response['mobile_image'] = this.generateImageObject(element.querySelector('img:nth-child(2)').getAttribute('src'));
      }

      return Promise.resolve({});
    };
    /**
     * Generate the image object
     *
     * @param {string} src
     * @returns {ImageObject}
     */


    _proto.generateImageObject = function generateImageObject(src) {
      // Match the URL & type from the directive
      if (/{{.*\s*url="?(.*\.([a-z|A-Z]*))"?\s*}}/.test(decodeURIComponent(src))) {
        var _$exec = /{{.*\s*url="?(.*\.([a-z|A-Z]*))"?\s*}}/.exec(decodeURIComponent(src)),
            _url = _$exec[1],
            _type = _$exec[2];

        return [{
          "name": _url.split('/').pop(),
          "size": 0,
          "type": "image/" + _type,
          "url": _config.getInitConfig('media_url') + _url
        }];
      }

      return "";
    };

    return Slide;
  }();

  return Slide;
});
//# sourceMappingURL=slide.js.map
