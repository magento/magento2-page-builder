/*eslint-disable */
define(["Magento_PageBuilder/js/property/link", "Magento_PageBuilder/js/utils/color-converter", "Magento_PageBuilder/js/utils/extract-alpha-from-rgba", "Magento_PageBuilder/js/utils/image"], function (_link, _colorConverter, _extractAlphaFromRgba, _image) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Collage =
  /*#__PURE__*/
  function () {
    function Collage() {
      this.linkConverter = new _link();
    }

    var _proto = Collage.prototype;

    /**
     * Read background from the element
     * Reuse default reader logic to point at mobile version
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      var mobileImage = "";
      var target = element.querySelector("a").getAttribute("target");
      var backgroundImage = element.querySelector(".pagebuilder-mobile-hidden").style.backgroundImage;
      var backgroundMobileImageElement = element.querySelector(".pagebuilder-mobile-only");
      var linkUrl = element.querySelector("a");

      if (backgroundMobileImageElement !== undefined && backgroundMobileImageElement.style.backgroundImage !== "" && backgroundImage !== backgroundMobileImageElement.style.backgroundImage) {
        mobileImage = (0, _image.decodeUrl)(backgroundMobileImageElement.style.backgroundImage);
      }

      var overlayColor = element.querySelector(".pagebuilder-overlay").getAttribute("data-overlay-color");
      var paddingSrc = element.querySelector(".pagebuilder-mobile-only").style;
      var marginSrc = element.style;
      var button = element.querySelector("button");
      var buttonText = button ? button.textContent : "";
      var buttonType = button ? button.classList[1] : "pagebuilder-button-primary";
      var response = {
        background_image: (0, _image.decodeUrl)(backgroundImage),
        background_size: element.style.backgroundSize,
        button_text: buttonText,
        button_type: buttonType,
        link_url: this.linkConverter.read(linkUrl),
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
        content: element.querySelector(".pagebuilder-collage-content div").innerHTML,
        min_height: element.querySelector(".pagebuilder-slide-wrapper").style.minHeight ? parseInt(element.querySelector(".pagebuilder-slide-wrapper").style.minHeight, 10) : 0,
        mobile_image: mobileImage,
        open_in_new_tab: target && target === "_blank" ? "1" : "0",
        overlay_color: this.getOverlayColor(overlayColor),
        overlay_transparency: this.getOverlayTransparency(overlayColor),
        show_button: element.getAttribute("data-show-button"),
        show_overlay: element.getAttribute("data-show-overlay"),
        text_align: element.querySelector(".pagebuilder-slide-wrapper").style.textAlign
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

    return Collage;
  }();

  return Collage;
});
//# sourceMappingURL=collage.js.map
