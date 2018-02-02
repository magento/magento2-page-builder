/*eslint-disable */
define(["../../../utils/colors", "../../../utils/image", "../../../utils/extractAlphaFromRgba"], function (_colors, _image, _extractAlphaFromRgba) {
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
      var target = element.querySelector("a").getAttribute("target");
      var bgImage = element.querySelector(".pagebuilder-banner-image").getAttribute("style").split(";")[0];
      var bgMobileImageEl = element.querySelector(".pagebuilder-banner-mobile");
      var bgMobileImage = element.querySelector(".pagebuilder-banner-mobile").getAttribute("style").split(";")[0];
      var overlayColor = element.querySelector(".pagebuilder-poster-overlay").getAttribute("data-background-color");
      var response = {
        background_size: element.style.backgroundSize,
        button_text: element.dataset.buttonText,
        image: (0, _image.decodeUrl)(bgImage),
        link_url: element.querySelector("a").getAttribute("href"),
        message: element.querySelector(".pagebuilder-poster-content div").innerHTML,
        minimum_height: element.querySelector(".pagebuilder-banner-wrapper").style.minHeight.split("px")[0],
        mobile_image: bgMobileImageEl ? (0, _image.decodeUrl)(bgMobileImage) : "",
        open_in_new_tab: target && target === "_blank" ? "1" : "0",
        overlay_color: this.getOverlayColor(overlayColor),
        overlay_transparency: this.getOverlayTransparency(overlayColor),
        show_button: element.getAttribute("data-show-button"),
        show_overlay: element.getAttribute("data-show-overlay")
      };
      return Promise.resolve(response);
    };
    /**
     * Get overlay color
     *
     * @returns string
     */


    _proto.getOverlayColor = function getOverlayColor(value) {
      return value === "transparent" ? "" : _colors.toHex(value);
    };
    /**
     * Get overlay transparency
     *
     * @returns string
     */


    _proto.getOverlayTransparency = function getOverlayTransparency(value) {
      return value === "transparent" ? "0" : (0, _extractAlphaFromRgba)(value);
    };

    return Banner;
  }();

  return Banner;
});
//# sourceMappingURL=banner.js.map
