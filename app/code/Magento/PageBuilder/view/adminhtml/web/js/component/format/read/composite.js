/*eslint-disable */
define(["Magento_PageBuilder/js/component/loader", "underscore", "../../config"], function (_loader, _underscore, _config) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var AttributeReaderComposite =
  /*#__PURE__*/
  function () {
    // Configuration for content types
    function AttributeReaderComposite() {
      this.contentTypeConfig = void 0;
      this.contentTypeConfig = _config.getInitConfig("contentTypes");
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
            var readersKey = "readers";
            (0, _loader)(_this.contentTypeConfig[role][readersKey], function () {
              var readerPromises = [];

              for (var _len = arguments.length, readers = new Array(_len), _key = 0; _key < _len; _key++) {
                readers[_key] = arguments[_key];
              }

              for (var _i = 0; _i < readers.length; _i++) {
                var aReader = readers[_i];
                var reader = new aReader();
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
