/*eslint-disable */
/* jscs:disable */

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

define(["Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/content-type/preview"], function (_config, _contentTypeFactory, _preview) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var PreviewCollection = /*#__PURE__*/function (_preview2) {
    "use strict";

    _inheritsLoose(PreviewCollection, _preview2);

    function PreviewCollection() {
      return _preview2.apply(this, arguments) || this;
    }

    var _proto = PreviewCollection.prototype;

    /**
     * Duplicate a collection content type
     *
     * @param {ContentTypeCollectionInterface} contentType
     * @param {boolean} autoAppend
     * @param {boolean} direct
     * @returns {Promise<ContentTypeCollectionInterface> | void}
     */
    _proto.clone = function clone(contentType, autoAppend, direct) {
      var _this = this;

      if (autoAppend === void 0) {
        autoAppend = true;
      }

      if (direct === void 0) {
        direct = false;
      }

      var defaultViewport = _config.getConfig("defaultViewport");

      var index = contentType.parentContentType.getChildren().indexOf(contentType) + 1 || null;
      var childrenLength = contentType.children ? contentType.children().length : 0;
      return new Promise(function (resolve, reject) {
        (0, _contentTypeFactory)(contentType.config, contentType.parentContentType, contentType.stageId, contentType.dataStores[defaultViewport].getState(), childrenLength, contentType.getDataStoresStates()).then(function (duplicate) {
          if (contentType.children && contentType.children().length > 0) {
            // Duplicate the instances children into the new duplicate
            contentType.children().forEach(function (subChild) {
              var subChildClone = duplicate.preview.clone(subChild, false);

              if (subChildClone) {
                subChildClone.then(function (duplicateSubChild) {
                  duplicateSubChild.parentContentType = duplicate;
                  duplicate.addChild(duplicateSubChild);
                });
              } else {
                reject("Unable to duplicate sub child.");
              }
            });
          }

          if (autoAppend) {
            contentType.parentContentType.addChild(duplicate, index);
          }

          _this.dispatchContentTypeCloneEvents(contentType, duplicate, index, direct);

          resolve(duplicate);
        });
      });
    }
    /**
     * Tries to call specified method of a current content type,
     * and delegates attempt to its' children.
     * @param args
     */
    ;

    _proto.delegate = function delegate() {
      var _preview2$prototype$d;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_preview2$prototype$d = _preview2.prototype.delegate).call.apply(_preview2$prototype$d, [this].concat(args));

      this.contentType.getChildren()().forEach(function (elem) {
        elem.preview.delegate.apply(elem.preview, args);
      });
    }
    /**
     * Does the current instance have any children or values different from the default for it's type?
     *
     * @returns {boolean}
     */
    ;

    _proto.isConfigured = function isConfigured() {
      if (this.contentType.children().length > 0) {
        return true;
      }

      return _preview2.prototype.isConfigured.call(this);
    };

    _createClass(PreviewCollection, [{
      key: "childTemplate",
      get:
      /**
       * Retrieve the preview child template
       *
       * @returns {string}
       */
      function get() {
        return "Magento_PageBuilder/content-type/preview-collection";
      }
    }]);

    return PreviewCollection;
  }(_preview);

  return PreviewCollection;
});
//# sourceMappingURL=preview-collection.js.map