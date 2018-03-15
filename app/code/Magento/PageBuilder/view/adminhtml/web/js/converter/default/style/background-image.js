/*eslint-disable */
define(["../../../component/config", "../../../utils/image", "../../../utils/directives", "../../../utils/url"], function (_config, _image, _directives, _url) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var BackgroundImage =
  /*#__PURE__*/
  function () {
    function BackgroundImage() {}

    var _proto = BackgroundImage.prototype;

    _proto.fromDom = function fromDom(value, key, data) {
      return (0, _image.decodeUrl)(value);
    };

    _proto.toDom = function toDom(value, key, data) {
      if (value[0] === undefined || value[0].url === undefined) {
        return null;
      }

      var imageUrl = value[0].url;
      var mediaUrl = (0, _url.convertUrlToPathIfOtherUrlIsOnlyAPath)(_config.getInitConfig("media_url"), imageUrl);
      var mediaPath = imageUrl.split(mediaUrl);
      var directive = "{{media url=" + mediaPath[1] + "}}";
      return "url(\'" + (0, _directives.toDataUrl)(directive) + "\')";
    };

    return BackgroundImage;
  }();

  return BackgroundImage;
});
//# sourceMappingURL=background-image.js.map
