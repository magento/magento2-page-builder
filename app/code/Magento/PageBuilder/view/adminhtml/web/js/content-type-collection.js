/*eslint-disable */
/* jscs:disable */

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

define(["Magento_PageBuilder/js/events", "underscore", "Magento_PageBuilder/js/collection", "Magento_PageBuilder/js/content-type"], function (_events, _underscore, _collection, _contentType) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ContentTypeCollection =
  /*#__PURE__*/
  function (_contentType2) {
    "use strict";

    _inheritsLoose(ContentTypeCollection, _contentType2);

    /**
     * @param {ContentTypeInterface} parentContentType
     * @param {ContentTypeConfigInterface} config
     * @param {string} stageId
     */
    function ContentTypeCollection(parentContentType, config, stageId) {
      var _this;

      _this = _contentType2.call(this, parentContentType, config, stageId) || this;
      _this.collection = new _collection();

      _this.collection.getChildren().subscribe(function () {
        return _events.trigger("stage:updateAfter", {
          stageId: _this.stageId
        });
      });

      return _this;
    }
    /**
     * Return the children of the current element
     *
     * @returns {KnockoutObservableArray<ContentTypeInterface | ContentTypeCollectionInterface>}
     */


    var _proto = ContentTypeCollection.prototype;

    _proto.getChildren = function getChildren() {
      return this.collection.getChildren();
    }
    /**
     * Add a child into the observable array
     *
     * @param {ContentTypeInterface | ContentTypeCollectionInterface} child
     * @param {number} index
     */
    ;

    _proto.addChild = function addChild(child, index) {
      child.parentContentType = this;
      this.collection.addChild(child, index); // Trigger a mount event when a child is added into a container content type, meaning it'll be re-rendered

      _underscore.defer(function () {
        _events.trigger("contentType:mountAfter", {
          id: child.id,
          contentType: child
        });

        _events.trigger(child.config.name + ":mountAfter", {
          id: child.id,
          contentType: child
        });
      });
    }
    /**
     * Remove a child from the observable array
     *
     * @param {ContentTypeInterface} child
     */
    ;

    _proto.removeChild = function removeChild(child) {
      this.collection.removeChild(child);
    }
    /**
     * Destroys current instance and all children
     */
    ;

    _proto.destroy = function destroy() {
      [].concat(this.getChildren()()).forEach(function (contentType) {
        contentType.destroy();
      });

      _contentType2.prototype.destroy.call(this);
    }
    /**
     * Set the children observable array into the class
     *
     * @param {KnockoutObservableArray<ContentTypeInterface>} children
     */
    ;

    _proto.setChildren = function setChildren(children) {
      this.collection.setChildren(children);
    };

    _createClass(ContentTypeCollection, [{
      key: "children",
      get: function get() {
        return this.collection.getChildren();
      }
    }]);

    return ContentTypeCollection;
  }(_contentType);

  return ContentTypeCollection;
});
//# sourceMappingURL=content-type-collection.js.map