/*eslint-disable */
define(["../../../style-attribute-mapper"], function (_styleAttributeMapper) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Collage =
  /*#__PURE__*/
  function () {
    function Collage() {
      this.styleAttributeMapper = new _styleAttributeMapper();
    }

    var _proto = Collage.prototype;

    /**
     * Read background from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      var response = {
        background_image: null,
        mobile_image: null
      };
      var background;
      var mobile;
      background = element.children[0].style.backgroundImage;
      response.background_image = this.styleAttributeMapper.decodeBackground(background);

      if (element.children[1] !== undefined && element.children[1].style.backgroundImage !== "" && background !== element.children[1].style.backgroundImage) {
        mobile = element.children[1].style.backgroundImage;
        response.mobile_image = this.styleAttributeMapper.decodeBackground(mobile);
      }

      return Promise.resolve(response);
    };

    return Collage;
  }();

  return Collage;
});
//# sourceMappingURL=collage.js.map
