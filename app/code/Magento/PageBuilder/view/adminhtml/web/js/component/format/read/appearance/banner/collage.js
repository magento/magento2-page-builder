/*eslint-disable */
define(["../../../../../utils/image"], function (_image) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Collage =
  /*#__PURE__*/
  function () {
    function Collage() {}

    var _proto = Collage.prototype;

    /**
     * Read background from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      var background;
      var mobile;
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
      background = element.children[0].style.backgroundImage;
      response.background_image = (0, _image.decodeUrl)(background);

      if (element.children[1] !== undefined && element.children[1].style.backgroundImage !== "" && background !== element.children[1].style.backgroundImage) {
        mobile = element.children[1].style.backgroundImage;
        response.mobile_image = (0, _image.decodeUrl)(mobile);
      }

      return Promise.resolve(response);
    };
    /**
     * Get overlay color
     *
     * @returns string
     */


    Collage.getOverlayColor = function getOverlayColor(value) {
      if (value === "transparent") {
        return "";
      } else {
        return Colors.toHex(value);
      }
    };
    /**
     * Get overlay transparency
     *
     * @returns string
     */


    Collage.getOverlayTransparency = function getOverlayTransparency(value) {
      if (value === "transparent") {
        return "0";
      } else {
        return Banner.extractAlphaFromRgba(value);
      }
    };
    /**
     * Extract the Alpha component from RGBA and convert from decimal to percent for overlay transparency
     *
     * @returns int
     */


    Collage.extractAlphaFromRgba = function extractAlphaFromRgba(value) {
      var a = parseFloat(value.match(/\d+/g)[3] + "." + value.match(/\d+/g)[4]) || 1;
      return Math.floor(a * 100);
    };

    return Collage;
  }();

  return Collage;
});
//# sourceMappingURL=collage.js.map
