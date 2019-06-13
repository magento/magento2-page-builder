/*eslint-disable */
define(["knockout"], function (_knockout) {
  var RenderContentType =
  /*#__PURE__*/
  function () {
    "use strict";

    function RenderContentType(content) {
      this.children = _knockout.observableArray([]);
      content.contentType = this;
      this.content = content;
    }
    /**
     * Return the children of the current content type
     */


    var _proto = RenderContentType.prototype;

    _proto.getChildren = function getChildren() {
      return this.children;
    };

    return RenderContentType;
  }();

  return RenderContentType;
});
//# sourceMappingURL=content-type.js.map