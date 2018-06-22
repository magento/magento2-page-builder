/*eslint-disable */
define(["events", "underscore", "Magento_PageBuilder/js/collection", "Magento_PageBuilder/js/content-type"], function (_events, _underscore, _collection, _contentType) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var ContentTypeCollection =
  /*#__PURE__*/
  function (_ContentType) {
    _inheritsLoose(ContentTypeCollection, _ContentType);

    /**
     * @param {ContentTypeInterface} parent
     * @param {ContentTypeConfigInterface} config
     * @param {string} stageId
     */
    function ContentTypeCollection(parent, config, stageId) {
      var _this;

      _this = _ContentType.call(this, parent, config, stageId) || this;
      _this.collection = new _collection();

      _this.collection.getChildren().subscribe(function () {
        return _events.trigger("stage:updated", {
          stageId: _this.stageId
        });
      });

      return _this;
    }
    /**
     * Return the children of the current element
     *
     * @returns {KnockoutObservableArray<ContentTypeInterface>}
     */


    var _proto = ContentTypeCollection.prototype;

    _proto.getChildren = function getChildren() {
      return this.collection.getChildren();
    };
    /**
     * Add a child into the observable array
     *
     * @param child
     * @param index
     */


    _proto.addChild = function addChild(child, index) {
      child.parent = this;
      this.collection.addChild(child, index); // Trigger a mount event when a child is added into a parent, meaning it'll be re-rendered

      _underscore.defer(function () {
        _events.trigger("contentType:mount", {
          id: child.id,
          contentType: child
        });

        _events.trigger(child.config.name + ":contentType:mount", {
          id: child.id,
          contentType: child
        });
      });
    };
    /**
     * Remove a child from the observable array
     *
     * @param child
     */


    _proto.removeChild = function removeChild(child) {
      this.collection.removeChild(child);
    };
    /**
     * Set the children observable array into the class
     *
     * @param children
     */


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
