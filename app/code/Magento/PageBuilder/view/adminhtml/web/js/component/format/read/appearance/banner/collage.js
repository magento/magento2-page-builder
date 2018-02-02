/*eslint-disable */
define(["../../../../../utils/colors", "../../../../../utils/extractAlphaFromRgba", "../../../../../utils/image", "../../default"], function (_colors, _extractAlphaFromRgba, _image, _default) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Collage =
  /*#__PURE__*/
  function () {
    function Collage() {
      this.defaultReader = new _default();
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
      var mobile = "";
      var target = element.querySelector("a").getAttribute("target");
      var bgImage = element.querySelector(".pagebuilder-mobile-hidden").style.backgroundImage;
      var bgMobileImageEl = element.querySelector(".pagebuilder-mobile-only");

      if (bgMobileImageEl !== undefined && bgMobileImageEl.style.backgroundImage !== "" && bgImage !== bgMobileImageEl.style.backgroundImage) {
        mobile = (0, _image.decodeUrl)(bgMobileImageEl.style.backgroundImage);
      }

      var advancedData = this.defaultReader.read(element.querySelector(".pagebuilder-mobile-only"));
      var overlayColor = element.querySelector(".pagebuilder-overlay").getAttribute("data-background-color");
      var response = {
        background_image: (0, _image.decodeUrl)(bgImage),
        background_size: element.style.backgroundSize,
        button_text: element.dataset.buttonText,
        link_url: element.querySelector("a").getAttribute("href"),
        message: element.querySelector(".pagebuilder-collage-content div").innerHTML,
        minimum_height: parseInt(element.querySelector(".pagebuilder-overlay").style.minHeight, 10),
        mobile_image: mobile,
        open_in_new_tab: target && target === "_blank" ? "1" : "0",
        overlay_color: this.getOverlayColor(overlayColor),
        overlay_transparency: this.getOverlayTransparency(overlayColor),
        show_button: element.getAttribute("data-show-button"),
        show_overlay: element.getAttribute("data-show-overlay")
      };
      return new Promise(function (resolve) {
        advancedData.then(function (data) {
          delete data.css_classes;
          resolve(Object.assign(data, response));
        });
      });
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

    return Collage;
  }();

  return Collage;
});
//# sourceMappingURL=collage.js.map
