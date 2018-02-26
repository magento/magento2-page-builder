/*eslint-disable */
define(["../../../utils/image"], function (_image) {
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
      var imageLinkElement = element.querySelector("a");
      var captionElement = element.querySelector("figcaption");
      var response = {
        alt: "",
        image: "",
        image_caption: captionElement ? captionElement.textContent : "",
        link_target: imageLinkElement ? imageLinkElement.target : "",
        link_url: imageLinkElement ? imageLinkElement.getAttribute("href") : "",
        mobile_image: "",
        title_tag: ""
      };

      if (element.querySelector("img:nth-child(1)")) {
        if (element.querySelector("img:nth-child(1)").getAttribute("src")) {
          response.image = (0, _image.decodeUrl)(element.querySelector("img:nth-child(1)").getAttribute("src"));
        }

        if (element.querySelector("img:nth-child(1)").getAttribute("alt")) {
          response.alt = element.querySelector("img:nth-child(1)").getAttribute("alt");
        }

        if (element.querySelector("img:nth-child(1)").getAttribute("title")) {
          response.title_tag = element.querySelector("img:nth-child(1)").getAttribute("title");
        }
      }

      if (element.querySelector("img:nth-child(2)") && element.querySelector("img:nth-child(2)").getAttribute("src")) {
        response.mobile_image = (0, _image.decodeUrl)(element.querySelector("img:nth-child(2)").getAttribute("src"));
      }

      return Promise.resolve(response);
    };

    return Image;
  }();

  return Image;
});
//# sourceMappingURL=image.js.map
