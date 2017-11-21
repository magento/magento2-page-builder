define(["../../../component/config"], function (_config) {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Image =
  /*#__PURE__*/
  function () {
    function Image() {}

    var _proto = Image.prototype;

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      var mainImageUrl = decodeURIComponent(element.children[0].children[0].getAttribute('src')).split('media url=').pop();
      mainImageUrl = mainImageUrl.substring(0, mainImageUrl.length - 2);
      var mainImageObj = {
        "name": mainImageUrl.split('/').pop(),
        "size": 0,
        "type": "image/" + mainImageUrl.split('.').pop(),
        "url": _config.getInitConfig('media_url') + mainImageUrl
      };
      var mobileImageUrl = decodeURIComponent(element.children[0].children[1].getAttribute('src')).split('media url=').pop();
      mobileImageUrl = mobileImageUrl.substring(0, mobileImageUrl.length - 2);
      var mobileImageObj = {
        "name": mobileImageUrl.split('/').pop(),
        "size": 0,
        "type": "image/" + mobileImageUrl.split('.').pop(),
        "url": _config.getInitConfig('media_url') + mobileImageUrl
      };
      return new Promise(function (resolve) {
        resolve({
          'image': [mainImageObj],
          'mobile_image': [mobileImageObj],
          'alt': element.children[0].children[0].getAttribute('alt'),
          'title_tag': element.children[0].children[0].getAttribute('title'),
          'lightbox': element.children[0].getAttribute('class') == 'bluefoot-lightbox' ? "Yes" : "No",
          'show_caption': element.children[1].getInnerText() != "" ? "Yes" : "No"
        });
      });
    };

    return Image;
  }();

  return Image;
});
//# sourceMappingURL=image.js.map
