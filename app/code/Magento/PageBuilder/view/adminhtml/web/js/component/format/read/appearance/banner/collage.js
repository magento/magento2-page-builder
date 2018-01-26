/*eslint-disable */
define(["../../../../config"], function (_config) {
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
      response.background_image = this.decodeBackground(background);
      return Promise.resolve(response);
    };
    /**
     * Decode background image back into object format
     *
     * @param value
     * @returns {Object}
     */


    _proto.decodeBackground = function decodeBackground(value) {
      value = decodeURIComponent(value.replace(window.location.href, ""));

      var _$exec = /{{.*\s*url="?(.*\.([a-z|A-Z]*))"?\s*}}/.exec(value),
          url = _$exec[1],
          type = _$exec[2];

      var image = {
        name: url.split("/").pop(),
        size: 0,
        type: "image/" + type,
        url: _config.getInitConfig("media_url") + url
      };
      value = [image];
      return value;
    };

    return Collage;
  }();

  return Collage;
});
//# sourceMappingURL=collage.js.map
