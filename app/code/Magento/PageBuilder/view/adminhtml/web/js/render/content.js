/*eslint-disable */
define([], function () {
  var _ref;

  var RenderContentType =
  /*#__PURE__*/
  function () {
    "use strict";

    function RenderContentType() {}

    var _proto = RenderContentType.prototype;

    /**
     * Return the children of the current element
     *
     * @returns {KnockoutObservableArray<RenderViewModel>}
     */
    _proto.getChildren = function getChildren() {
      return this.children;
    };

    return RenderContentType;
  }();

  var RenderViewModel = function RenderViewModel(contentType, masterTemplate, data) {
    "use strict";

    this.data = {};
    this.contentType = contentType;
    this.masterTemplate = masterTemplate;
    this.data = data;
  };

  return _ref = {
    RenderViewModel: _exports.RenderContentType = void 0,
    RenderContentType: RenderContentType
  }, _ref["RenderViewModel"] = RenderViewModel, _ref;
});
//# sourceMappingURL=content.js.map