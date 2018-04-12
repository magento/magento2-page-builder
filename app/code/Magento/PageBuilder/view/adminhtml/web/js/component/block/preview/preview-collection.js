/*eslint-disable */
define(["Magento_PageBuilder/js/component/block/preview/block"], function (_block) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var PreviewCollection =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(PreviewCollection, _Block);

    function PreviewCollection() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = PreviewCollection.prototype;

    /**
     * Does the current instance have any children or values different from the default for it's type?
     *
     * @returns {boolean}
     */
    _proto.isConfigured = function isConfigured() {
      if (this.parent.children && this.parent.children().length > 0) {
        return true;
      }
    };

    _createClass(PreviewCollection, [{
      key: "previewChildTemplate",

      /**
       * Retrieve the preview child template
       *
       * @returns {string}
       */
      get: function get() {
        return "Magento_PageBuilder/component/block/preview/children.html";
      }
    }]);

    return PreviewCollection;
  }(_block);

  return PreviewCollection;
});
//# sourceMappingURL=preview-collection.js.map
