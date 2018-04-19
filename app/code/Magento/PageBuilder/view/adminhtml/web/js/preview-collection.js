/*eslint-disable */
define(["Magento_PageBuilder/js/preview"], function (_preview) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var PreviewCollection =
  /*#__PURE__*/
  function (_Preview) {
    _inheritsLoose(PreviewCollection, _Preview);

    function PreviewCollection() {
      return _Preview.apply(this, arguments) || this;
    }

    var _proto = PreviewCollection.prototype;

    /**
     * Does the current instance have any children or values different from the default for it's type?
     *
     * @returns {boolean}
     */
    _proto.isConfigured = function isConfigured() {
      if (this.parent.children().length > 0) {
        return true;
      }
    };
    /**
     * Duplicate content type
     *
     * @param {ContentTypeInterface} child
     * @param {boolean} autoAppend
     * @returns {ContentTypeInterface}
     */


    _proto.clone = function clone(child, autoAppend) {
      if (autoAppend === void 0) {
        autoAppend = true;
      }

      var store = child.store;
      var instance = child.constructor;
      var duplicate = new instance(child.parent, child.config, child.stageId);
      duplicate.preview = child.preview;
      duplicate.content = child.content;
      var index = child.parent.getChildren().indexOf(child) + 1 || null;
      store.update(duplicate.id, Object.assign({}, store.get(child.id)));
      child.getChildren()().forEach(function (subChild, childIndex) {
        var createDuplicate = subChild.preview.clone(subChild, false);
        createDuplicate.preview = subChild.preview;
        createDuplicate.content = subChild.content;

        if (createDuplicate) {
          duplicate.addChild(createDuplicate, childIndex);
        }
      });
      this.dispatchContentTypeCloneEvents(child, duplicate, index);

      if (autoAppend) {
        child.parent.addChild(duplicate, index);
      }

      return duplicate;
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
  }(_preview);

  return PreviewCollection;
});
//# sourceMappingURL=preview-collection.js.map
