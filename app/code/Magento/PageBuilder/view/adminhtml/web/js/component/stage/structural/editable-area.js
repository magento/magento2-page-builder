/*eslint-disable */
define(["mage/translate", "mageUtils", "../../../utils/array", "../../event-bus"], function (_translate, _mageUtils, _array, _eventBus) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var EditableArea =
  /*#__PURE__*/
  function () {
    /**
     * EditableArea constructor
     *
     * @param stage
     */
    function EditableArea(stage) {
      this.id = _mageUtils.uniqueid();
      this.children = void 0;
      this.stage = void 0;
      this.title = (0, _translate)("Editable");
      this.parent = void 0;

      if (stage) {
        this.stage = stage;
      }

      this.bindEvents();
    }
    /**
     * Retrieve the child template
     *
     * @returns {string}
     */


    var _proto = EditableArea.prototype;

    /**
     * Return the children of the current element
     *
     * @returns {KnockoutObservableArray<Structural>}
     */
    _proto.getChildren = function getChildren() {
      return this.children;
    };
    /**
     * Duplicate a child of the current instance
     *
     * @param {Structural} child
     * @param {boolean} autoAppend
     * @returns {Structural}
     */


    _proto.duplicateChild = function duplicateChild(child, autoAppend) {
      if (autoAppend === void 0) {
        autoAppend = true;
      }

      var store = this.stage.store;
      var instance = child.constructor;
      var duplicate = new instance(child.parent, child.stage, child.config, child.getData(), child.elementConverterPool);
      var index = child.parent.children.indexOf(child) + 1 || null; // Copy the data from the data store

      store.update(duplicate.id, Object.assign({}, store.get(child.id))); // Duplicate the instances children into the new duplicate

      if (child.children().length > 0) {
        child.children().forEach(function (subChild, childIndex) {
          duplicate.addChild(duplicate.duplicateChild(subChild, false), childIndex);
        });
      }

      if (autoAppend) {
        this.addChild(duplicate, index);
      }

      return duplicate;
    };
    /**
     * Retrieve the stage instance
     *
     * @returns {Stage}
     */


    _proto.getStage = function getStage() {
      return this.stage;
    };
    /**
     * Add a child into the observable array
     *
     * @param child
     * @param index
     */


    _proto.addChild = function addChild(child, index) {
      child.parent = this;
      child.stage = this.stage;

      if (typeof index === "number") {
        // Use the arrayUtil function to add the item in the correct place within the array
        (0, _array.moveArrayItemIntoArray)(child, this.children, index);
      } else {
        this.children.push(child);
      }
    };
    /**
     * Remove a child from the observable array
     *
     * @param child
     */


    _proto.removeChild = function removeChild(child) {
      (0, _array.removeArrayItem)(this.children, child);
    };
    /**
     * Event called when starting starts on this element
     *
     * @param event
     * @param params
     */


    _proto.onSortStart = function onSortStart(event, params) {
      if (params.block.id === this.id) {
        var originalEle = jQuery(params.originalEle);
        originalEle.show();
        originalEle.addClass("pagebuilder-sorting-original"); // Reset the width & height of the helper

        jQuery(params.helper).css({
          width: "",
          height: ""
        }).html(jQuery("<h3 />").text(this.title).html());
      }
    };
    /**
     * Set the children observable array into the class
     *
     * @param children
     */


    _proto.setChildren = function setChildren(children) {
      var _this = this;

      this.children = children; // Attach a subscription to the children of every editable area to fire the stageUpdated event

      children.subscribe(function () {
        return _eventBus.trigger("stage:updated", {
          stage: _this.stage
        });
      });
    };
    /**
     * Bind events for the current instance
     */


    _proto.bindEvents = function bindEvents() {
      _eventBus.on("block:sortStart", this.onSortStart.bind(this));
    };

    _createClass(EditableArea, [{
      key: "childTemplate",
      get: function get() {
        return "Magento_PageBuilder/component/block/render/children.html";
      }
    }]);

    return EditableArea;
  }();

  return EditableArea;
});
//# sourceMappingURL=editable-area.js.map
