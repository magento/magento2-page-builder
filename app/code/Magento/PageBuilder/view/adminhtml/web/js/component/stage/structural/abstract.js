/*eslint-disable */
define(["knockout", "mage/translate", "underscore", "../../event-bus", "../../format/attribute-filter", "../../format/attribute-mapper", "../../format/style-attribute-filter", "../../format/style-attribute-mapper", "../edit", "./editable-area", "./options", "./options/option", "./options/title"], function (_knockout, _translate, _underscore, _eventBus, _attributeFilter, _attributeMapper, _styleAttributeFilter, _styleAttributeMapper, _edit, _editableArea, _options, _option, _title) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Structural =
  /*#__PURE__*/
  function (_EditableArea) {
    _inheritsLoose(Structural, _EditableArea);

    /**
     * Abstract structural constructor
     *
     * @param parent
     * @param stage
     * @param config
     */
    function Structural(parent, stage, config) {
      var _this;

      _this = _EditableArea.call(this, stage) || this;
      _this.config = void 0;
      _this.children = _knockout.observableArray([]);
      _this.edit = void 0;
      _this.title = void 0;
      _this.wrapperStyle = _knockout.observable({
        width: "100%"
      });
      _this.element = void 0;
      _this.attributeFilter = new _attributeFilter();
      _this.attributeMapper = new _attributeMapper();
      _this.styleAttributeFilter = new _styleAttributeFilter();
      _this.styleAttributeMapper = new _styleAttributeMapper();

      _this.setChildren(_this.children);

      _this.parent = parent;
      _this.config = config; // Create a new instance of edit for our editing needs

      _this.edit = new _edit(_this, _this.stage.store);
      return _this;
    }
    /**
     * Return an array of options
     *
     * @returns {Array<OptionInterface>}
     */


    var _proto = Structural.prototype;

    _proto.retrieveOptions = function retrieveOptions() {
      return [new _option.Option(this, "move", "<i></i>", (0, _translate)("Move"), null, ["move-structural"], 10), new _title.TitleOption(this, this.config.label, 20), new _option.Option(this, "edit", "<i></i>", (0, _translate)("Edit"), this.onOptionEdit, ["edit-block"], 30), new _option.Option(this, "duplicate", "<i class='icon-pagebuilder-copy'></i>", (0, _translate)("Duplicate"), this.onOptionDuplicate, ["duplicate-structural"], 40), new _option.Option(this, "remove", "<i></i>", (0, _translate)("Remove"), this.onOptionRemove, ["remove-structural"], 50)];
    };
    /**
     * Retrieve the template for the structural
     *
     * @returns {string}
     */


    /**
     * Handle user editing an instance
     */
    _proto.onOptionEdit = function onOptionEdit() {
      this.edit.open();
    };
    /**
     * Handle duplicate of items
     */


    _proto.onOptionDuplicate = function onOptionDuplicate() {
      this.parent.duplicateChild(this);
    };
    /**
     * Handle block removal
     */


    _proto.onOptionRemove = function onOptionRemove() {
      var _this2 = this;

      var removeBlock = function removeBlock() {
        return _eventBus.trigger("block:removed", {
          block: _this2,
          index: _this2.parent.children().indexOf(_this2),
          parent: _this2.parent
        });
      };

      if (this.isConfigured()) {
        this.stage.parent.confirmationDialog({
          actions: {
            confirm: function confirm() {
              // Call the parent to remove the child element
              removeBlock();
            }
          },
          content: (0, _translate)("Are you sure you want to remove this item? " + "The data within this item is not recoverable once removed."),
          dismissKey: "modal_dismissed_pagebuilder_remove",
          dismissible: true,
          title: (0, _translate)("Confirm Item Removal")
        });
      } else {
        removeBlock();
      }
    };
    /**
     * Get css classes for an block
     * Example {"class-name": true}
     *
     * @returns {DataObject}
     */


    _proto.getCss = function getCss() {
      var cssClasses = {};

      if ("css_classes" in this.getData() && this.getData().css_classes !== "") {
        this.getData().css_classes.toString().split(" ").map(function (value, index) {
          return cssClasses[value] = true;
        });
      }

      return cssClasses;
    };
    /**
     * Get stype properties for an block
     * Example {"backgroundColor": "#cccccc"}
     *
     * @returns {DataObject}
     */


    _proto.getStyle = function getStyle() {
      var styleAttributes = this.getData();

      if (typeof styleAttributes.appearance !== "undefined" && typeof styleAttributes.appearances !== "undefined" && typeof styleAttributes.appearances[styleAttributes.appearance] !== "undefined") {
        _underscore.extend(styleAttributes, styleAttributes.appearances[styleAttributes.appearance]);
      }

      return this.styleAttributeMapper.toDom(this.styleAttributeFilter.filter(styleAttributes));
    };
    /**
     * Get attributes for an block
     * Example {"data-role": "element"}
     *
     * @returns {DataObject}
     */


    _proto.getAttributes = function getAttributes(extra) {
      if (extra === void 0) {
        extra = {};
      }

      var data = this.getData();

      _underscore.extend(data, this.config);

      return _underscore.extend(this.attributeMapper.toDom(this.attributeFilter.filter(data)), extra);
    };
    /**
     * Get block data
     *
     * @returns {DataObject}
     */


    _proto.getData = function getData() {
      return this.stage.store.get(this.id);
    };
    /**
     * Does the current instance have any children or values different from the default for it's type?
     *
     * @returns {boolean}
     */


    _proto.isConfigured = function isConfigured() {
      if (this.children().length > 0) {
        return true;
      }

      var data = this.getData();
      var hasDataChanges = false;

      _underscore.each(this.config.fields, function (field, key) {
        var fieldValue = data[key]; // Default values can only ever be strings

        if (_underscore.isObject(fieldValue)) {
          fieldValue = JSON.stringify(fieldValue);
        }

        if (field.default !== fieldValue) {
          hasDataChanges = true;
          return;
        }
      });

      return hasDataChanges;
    };
    /**
     * Get the options instance
     *
     * @returns {Options}
     */


    _proto.getOptions = function getOptions() {
      return new _options.Options(this, this.retrieveOptions());
    };

    _createClass(Structural, [{
      key: "template",
      get: function get() {
        return "Magento_PageBuilder/component/stage/structural/abstract.html";
      }
      /**
       * Retrieve the preview child template
       *
       * @returns {string}
       */

    }, {
      key: "previewChildTemplate",
      get: function get() {
        return "Magento_PageBuilder/component/block/preview/children.html";
      }
      /**
       * Retrieve the child template
       *
       * @returns {string}
       */

    }, {
      key: "renderChildTemplate",
      get: function get() {
        return "Magento_PageBuilder/component/block/render/children.html";
      }
    }]);

    return Structural;
  }(_editableArea);

  return Structural;
});
//# sourceMappingURL=abstract.js.map
