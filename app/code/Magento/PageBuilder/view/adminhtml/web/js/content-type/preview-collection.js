/*eslint-disable */
define(["Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/content-type/preview"], function (_contentTypeFactory, _preview) {
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
     * Duplicate a collection content type
     *
     * @param {ContentTypeInterface & ContentTypeCollectionInterface} contentType
     * @param {boolean} autoAppend
     * @returns {Promise<ContentTypeCollectionInterface> | void}
     */
    _proto.clone = function clone(contentType, autoAppend) {
      var _this = this;

      if (autoAppend === void 0) {
        autoAppend = true;
      }

      var index = contentType.parent.getChildren().indexOf(contentType) + 1 || null;
      return new Promise(function (resolve, reject) {
        (0, _contentTypeFactory)(contentType.config, contentType.parent, contentType.stageId, contentType.dataStore.get()).then(function (duplicate) {
          if (contentType.children && contentType.children().length > 0) {
            // Duplicate the instances children into the new duplicate
            contentType.children().forEach(function (subChild) {
              var subChildClone = duplicate.preview.clone(subChild, false);

              if (subChildClone) {
                subChildClone.then(function (duplicateSubChild) {
                  duplicateSubChild.parent = duplicate;
                  duplicate.addChild(duplicateSubChild);
                });
              } else {
                reject("Unable to duplicate sub child.");
              }
            });
          }

          if (autoAppend) {
            contentType.parent.addChild(duplicate, index);
          }

          _this.dispatchContentTypeCloneEvents(contentType, duplicate, index);

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
        return "Magento_PageBuilder/content-type/preview-collection";
      }
    }]);

    return PreviewCollection;
  }(_preview);

  return PreviewCollection;
});
//# sourceMappingURL=preview-collection.js.map
