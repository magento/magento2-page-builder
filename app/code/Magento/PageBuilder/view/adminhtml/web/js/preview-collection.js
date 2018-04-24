/*eslint-disable */
define(["Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/preview"], function (_contentTypeFactory, _preview) {
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
     * Duplicate content type
     *
     * @param {ContentTypeInterface} contentBlock
     * @param {boolean} autoAppend
     * @returns {Promise<ContentTypeInterface>}
     */
    _proto.clone = function clone(contentBlock, autoAppend) {
      var _this = this;

      if (autoAppend === void 0) {
        autoAppend = true;
      }

      var index = contentBlock.parent.getChildren().indexOf(contentBlock) + 1 || null;
      return new Promise(function (resolve, reject) {
        (0, _contentTypeFactory)(contentBlock.config, contentBlock.parent, contentBlock.stageId, contentBlock.store.get(contentBlock.id)).then(function (duplicate) {
          if (contentBlock.children && contentBlock.children().length > 0) {
            // Duplicate the instances children into the new duplicate
            contentBlock.children().forEach(function (subChild) {
              duplicate.preview.clone(subChild, false).then(function (duplicateSubChild) {
                duplicateSubChild.parent = duplicate;
                duplicate.addChild(duplicateSubChild);
              });
            });
          }

          if (autoAppend) {
            contentBlock.parent.addChild(duplicate, index);
          }

          _this.dispatchContentTypeCloneEvents(contentBlock, duplicate, index);

          resolve(duplicate);
        });
      });
    };
    /**
     * Does the current instance have any children or values different from the default for it's type?
     *
     * @returns {boolean}
     */


    _proto.isConfigured = function isConfigured() {
      if (this.parent.children().length > 0) {
        return true;
      }

      return _Preview.prototype.isConfigured.call(this);
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
