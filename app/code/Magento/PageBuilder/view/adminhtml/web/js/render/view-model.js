/*eslint-disable */
define(["knockout"], function (_knockout) {
  var RenderViewModel =
  /*#__PURE__*/
  function () {
    "use strict";

    function RenderViewModel(template, data) {
      this.data = {};
      this.masterTemplate = "Magento_PageBuilder/content-type/master-collection";
      this.template = template;
      this.data = this.convertDataToObservables(data);
    }
    /**
     * Convert the flat object into observables for render
     * 
     * @param generatedData 
     */


    var _proto = RenderViewModel.prototype;

    _proto.convertDataToObservables = function convertDataToObservables(generatedData) {
      var convertedData = {};

      var _loop = function _loop(element) {
        convertedData[element] = {};
        Object.keys(generatedData[element]).forEach(function (key) {
          convertedData[element][key] = _knockout.observable(generatedData[element][key]);
        });
      };

      for (var element in generatedData) {
        _loop(element);
      }

      return convertedData;
    };

    return RenderViewModel;
  }();

  return RenderViewModel;
});
//# sourceMappingURL=view-model.js.map