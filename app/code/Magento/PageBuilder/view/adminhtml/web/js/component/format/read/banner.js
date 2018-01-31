/*eslint-disable */
define(["../../../utils/image"], function (_image) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Banner =
  /*#__PURE__*/
  function () {
    function Banner() {}

    var _proto = Banner.prototype;

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      var response = {
        background_image: null
      };
      var background;
      background = element.children[0].style.backgroundImage;
      response.background_image = (0, _image.decodeUrl)(background);
      return Promise.resolve(response);
    };

    return Banner;
  }();

  return Banner;
});
//# sourceMappingURL=banner.js.map
