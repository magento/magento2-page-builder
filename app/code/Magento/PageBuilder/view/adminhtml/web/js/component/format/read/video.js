/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Video =
  /*#__PURE__*/
  function () {
    function Video() {}

    var _proto = Video.prototype;

    /**
     * Read video configuration out of element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      var videoIframeElement = element.querySelector("iframe");
      var response = {
        video_height: videoIframeElement.height || null,
        video_source: videoIframeElement.src || "",
        video_width: videoIframeElement.width || null
      };
      return Promise.resolve(response);
    };

    return Video;
  }();

  return Video;
});
//# sourceMappingURL=video.js.map
