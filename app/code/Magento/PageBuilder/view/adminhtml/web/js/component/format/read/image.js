/*eslint-disable */
define(["../../../component/config"], function (_config) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
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
      var response = {
        alt: "",
        image: "",
        lightbox: !!element.querySelector("a.pagebuilder-lightbox") ? "Yes" : "No",
        mobile_image: "",
        show_caption: !!element.querySelector("figcaption") ? "Yes" : "No",
        title_tag: element.querySelector("a").getAttribute("title")
      }; // Detect if there is an image and update the response

      if (element.querySelector("img:nth-child(1)")) {
        if (element.querySelector("img:nth-child(1)").getAttribute("src")) {
          response.image = this.generateImageObject(element.querySelector("img:nth-child(1)").getAttribute("src"));
        }

        if (element.querySelector("img:nth-child(1)").getAttribute("alt")) {
          response.alt = element.querySelector("img:nth-child(1)").getAttribute("alt");
        }
      } // Detect if there is a mobile image and update the response


      if (element.querySelector("img:nth-child(2)") && element.querySelector("img:nth-child(2)").getAttribute("src")) {
        response.mobile_image = this.generateImageObject(element.querySelector("img:nth-child(2)").getAttribute("src"));
      }

      return Promise.resolve(response);
    };
    /**
     * Magentorate the image object
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
          name: _url.split("/").pop(),
          size: 0,
          type: "image/" + _type,
          url: _config.getInitConfig("media_url") + _url
        }];
      }

      return "";
    };

    return Image;
  }();

  return Image;
});
//# sourceMappingURL=image.js.map
