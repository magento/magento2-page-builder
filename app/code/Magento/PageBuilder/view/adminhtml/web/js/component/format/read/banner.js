/*eslint-disable */
define(["../../../utils/color-converter", "../../../utils/extract-alpha-from-rgba", "../../../utils/image"], function (_colorConverter, _extractAlphaFromRgba, _image) {
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
      var bgMobileImage = element.querySelector(".pagebuilder-banner-mobile").style.backgroundImage;
      var target = element.querySelector("a").getAttribute("target");
      var bgImage = element.querySelector(".pagebuilder-banner-image").style.backgroundImage;
      var overlayColor = element.querySelector(".pagebuilder-poster-overlay").getAttribute("data-overlay-color");
      var paddingSrc = element.querySelector(".pagebuilder-poster-overlay").style;
      var marginSrc = element.style;

      if (bgImage === bgMobileImage) {
        bgMobileImage = false;
      }

      var button = element.querySelector("button");
      var buttonText = button ? button.textContent : "";
      var buttonType = button ? button.classList[1] : "pagebuilder-button-primary";
      var response = {
        background_image: (0, _image.decodeUrl)(bgImage),
        background_size: element.style.backgroundSize,
        button_text: buttonText,
        button_type: buttonType,
        link_url: element.querySelector("a").getAttribute("href"),
        margins_and_padding: {
          margin: {
            bottom: marginSrc.marginBottom.replace("px", ""),
            left: marginSrc.marginLeft.replace("px", ""),
            right: marginSrc.marginRight.replace("px", ""),
            top: marginSrc.marginTop.replace("px", "")
          },
          padding: {
            bottom: paddingSrc.paddingBottom.replace("px", ""),
            left: paddingSrc.paddingLeft.replace("px", ""),
            right: paddingSrc.paddingRight.replace("px", ""),
            top: paddingSrc.paddingTop.replace("px", "")
          }
        },
        message: element.querySelector(".pagebuilder-poster-content div").innerHTML,
        min_height: element.querySelector(".pagebuilder-poster-overlay").style.minHeight.split("px")[0],
        mobile_image: bgMobileImage ? (0, _image.decodeUrl)(bgMobileImage) : "",
        open_in_new_tab: target && target === "_blank" ? "1" : "0",
        overlay_color: this.getOverlayColor(overlayColor),
        overlay_transparency: this.getOverlayTransparency(overlayColor),
        show_button: element.getAttribute("data-show-button"),
        show_overlay: element.getAttribute("data-show-overlay"),
        text_align: element.querySelector(".pagebuilder-banner-wrapper").style.textAlign
      };
      return Promise.resolve(response);
    };
    /**
     * Get overlay color
     *
     * @returns string
     */


    _proto.getOverlayColor = function getOverlayColor(value) {
      return value === "transparent" ? "" : (0, _colorConverter.toHex)(value);
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
