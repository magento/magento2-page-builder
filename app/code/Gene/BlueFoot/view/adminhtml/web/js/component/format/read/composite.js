define(["underscore", "Gene_BlueFoot/js/component/loader", "../../config"], function (_underscore, _loader, _config) {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var AttributeReaderComposite =
  /*#__PURE__*/
  function () {
    // Configuration for content types
    function AttributeReaderComposite() {
      this.contentTypeConfig = void 0;
      this.contentTypeConfig = _config.getInitConfig('contentTypes');
    }
    /**
     * Read data from the element
     *
     * @param element
     * @returns {Promise<any>}
     */


    var _proto = AttributeReaderComposite.prototype;

    _proto.read = function read(element) {
      var _this = this;

      var result = {};
      return new Promise(function (resolve, reject) {
        var role = element.dataset.role;

        if (!_this.contentTypeConfig.hasOwnProperty(role)) {
          resolve(result);
        } else {
          try {
            (0, _loader)(_this.contentTypeConfig[role]['readers'], function () {
              var readerPromises = [];

              for (var _len = arguments.length, readers = new Array(_len), _key = 0; _key < _len; _key++) {
                readers[_key] = arguments[_key];
              }

              for (var i = 0; i < readers.length; i++) {
                var reader = new readers[i]();
                readerPromises.push(reader.read(element));
              }

              Promise.all(readerPromises).then(function (readersData) {
                readersData.forEach(function (data) {
                  _underscore.extend(result, data);
                });
                resolve(result);
              }).catch(function (error) {
                console.error(error);
              });
            });
          } catch (e) {
            reject(e);
          }
        }
      });
    };

    return AttributeReaderComposite;
  }();

  return AttributeReaderComposite;
});
//# sourceMappingURL=composite.js.map
