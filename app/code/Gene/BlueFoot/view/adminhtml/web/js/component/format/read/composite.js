define(["underscore", "Gene_BlueFoot/js/component/loader"], function (_underscore, _loader) {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var AttributeReaderComposite =
  /*#__PURE__*/
  function () {
    function AttributeReaderComposite() {
      this.readers = {
        'stage': ['Gene_BlueFoot/js/component/format/read/default'],
        'row': ['Gene_BlueFoot/js/component/format/read/default'],
        'column': ['Gene_BlueFoot/js/component/format/read/default'],
        'heading': ['Gene_BlueFoot/js/component/format/read/default', 'Gene_BlueFoot/js/component/format/read/heading']
      };
    }

    var _proto = AttributeReaderComposite.prototype;

    /**
     * Read data from the element
     *
     * @param element
     * @returns {object}
     */
    _proto.read = function read(element) {
      if (this.readers.hasOwnProperty(element.dataset.role)) {
        var readPromise = new Promise(function (resolve, reject) {
          (0, _loader)(this.readers[element.dataset.role], function () {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            resolve(args);
          }, reject);
        }.bind(this));
        return readPromise.then(function (readersArray) {
          var result = {};

          for (var i = 0; i < readersArray.length; i++) {
            var reader = new readersArray[i]();

            _underscore.extend(result, reader.read(element));
          } // console.log(result);


          return result;
        }).catch(function (e) {});
      }

      return {};
    };

    return AttributeReaderComposite;
  }();

  return AttributeReaderComposite;
});
//# sourceMappingURL=composite.js.map
