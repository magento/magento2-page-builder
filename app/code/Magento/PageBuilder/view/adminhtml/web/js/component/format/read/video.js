/*eslint-disable */
define(["./default"], function (_default) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Video =
  /*#__PURE__*/
  function () {
    function Video() {
      this.defaultReader = new _default();
    }

    var _proto = Video.prototype;

    /**
     * Read video configuration out of element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      var videoIframeElement = element.querySelector("iframe");
      var iframeAttributesPromise = this.defaultReader.read(videoIframeElement);
      return iframeAttributesPromise.then(function (iframeAttributes) {
        iframeAttributes.video_source = iframeAttributes.src || "";
        return iframeAttributes;
      });
    };

    return Video;
  }();

  return Video;
});
//# sourceMappingURL=video.js.map
