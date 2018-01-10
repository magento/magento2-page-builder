/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Block =
  /*#__PURE__*/
  function () {
    function Block() {}

    var _proto = Block.prototype;

    /**
     * Read static block html from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      console.log('block.ts');
      console.log(element);
      return new Promise(function (resolve) {
        resolve({
          'html': 'Block'
        });
      });
    };

    return Block;
  }();

  return Block;
});
//# sourceMappingURL=block.js.map
