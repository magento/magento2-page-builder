/*eslint-disable */
define(["Magento_PageBuilder/js/property/link", "Magento_PageBuilder/js/utils/color-converter", "Magento_PageBuilder/js/utils/extract-alpha-from-rgba", "Magento_PageBuilder/js/utils/image", "Magento_PageBuilder/js/master-format/read/default"], function (_link, _colorConverter, _extractAlphaFromRgba, _image, _default) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Slide =
  /*#__PURE__*/
  function () {
    function Slide() {
      this.defaultReader = new _default();
      this.linkConverter = new _link();
    }

    var _proto = Slide.prototype;

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      var bgMobileImage = element.querySelectorAll(".pagebuilder-slide-wrapper")[0].style.backgroundImage;
      var slideName = element.getAttribute("data-slide-name");
      var linkUrl = element.querySelector("a");
      var bgImage = element.querySelectorAll(".pagebuilder-slide-wrapper")[1].style.backgroundImage;
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
        slide_name: slideName ? slideName : "",
        background_image: (0, _image.decodeUrl)(bgImage),
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
        content: element.querySelector(".pagebuilder-poster-content div").innerHTML,
        min_height: element.querySelector(".pagebuilder-poster-overlay").style.minHeight.split("px")[0],
        mobile_image: bgMobileImage ? (0, _image.decodeUrl)(bgMobileImage) : "",
        overlay_color: this.getOverlayColor(overlayColor),
        overlay_transparency: this.getOverlayTransparency(overlayColor),
        show_button: element.getAttribute("data-show-button"),
        show_overlay: element.getAttribute("data-show-overlay"),
        text_align: element.querySelector(".pagebuilder-slide-wrapper").style.textAlign
      };
      var slideAttributeElement = element.querySelector("div");
      var slideAttributesPromise = this.defaultReader.read(slideAttributeElement);
      return slideAttributesPromise.then(function (slideAttributes) {
        delete slideAttributes.css_classes;
        return Promise.resolve(Object.assign(slideAttributes, response));
      });
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

    return Slide;
  }();

  return Slide;
});
//# sourceMappingURL=slide.js.map
