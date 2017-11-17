define([], function () {
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
      return new Promise(function (resolve) {
        //element
        resolve({
          'heading_type': element.nodeName,
          'title': element.innerText
        });
      });
    };

    return Image;
  }();

  return Image;
});
//# sourceMappingURL=image.js.map
