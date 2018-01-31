/*eslint-disable */
define(["../style-attribute-mapper"], function (_styleAttributeMapper) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Banner =
  /*#__PURE__*/
  function () {
    function Banner() {
      this.styleAttributeMapper = new _styleAttributeMapper();
    }

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
      response.background_image = this.styleAttributeMapper.decodeBackground(background);
      return Promise.resolve(response);
    };

    return Banner;
  }();

  return Banner;
});
//# sourceMappingURL=banner.js.map
