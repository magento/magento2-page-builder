define(["underscore", "knockout", "mage/translate", "./editable-area", "./options", "./options/option", "./column/builder", "../edit", "../../format/style-attribute-filter", "../../format/style-attribute-mapper", "../../format/attribute-filter", "../../format/attribute-mapper", "../../appearance/appearance"], function (_underscore, _knockout, _translate, _editableArea, _options, _option, _builder, _edit, _styleAttributeFilter, _styleAttributeMapper, _attributeFilter, _attributeMapper, _appearance) {
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
     * @param appearance
     */
    function Structural(parent, stage, config, appearance) {
      var _this;

      if (config === void 0) {
        config = {};
      }

      if (appearance === void 0) {
        appearance = new _appearance({});
      }

      _this = _EditableArea.call(this, stage) || this;
      _this.wrapperStyle = _knockout.observable({
        width: '100%'
      });
      _this.optionsInstance = new _options.Options(_this, _this.options);
      _this.children = _knockout.observableArray([]);
      _this.columnBuilder = new _builder.ColumnBuilder();
      _this.styleAttributeFilter = new _styleAttributeFilter();
      _this.styleAttributeMapper = new _styleAttributeMapper();
      _this.attributeFilter = new _attributeFilter();
      _this.attributeMapper = new _attributeMapper();

      _this.setChildren(_this.children); // Create a new instance of edit for our editing needs


      _this.edit = new _edit(_this, _this.stage.store);
      _this.appearance = appearance;
      _this.parent = parent;
      _this.config = config;
      hljs.initHighlightingOnLoad();
      return _this;
    }
    /**
     * Return an array of options
     *
     * @returns {Array<Option>}
     */


    var _proto = Structural.prototype;

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

      this.stage.parent.confirmationDialog({
        title: (0, _translate)('Confirm Item Removal'),
        content: (0, _translate)('Are you sure you want to remove this item? The data within this item is not recoverable once removed.'),
        actions: {
          confirm: function confirm() {
            // Call the parent to remove the child element
            _this2.parent.emit('blockRemoved', {
              block: _this2
            });
          }
        }
      });
    };
    /**
     * Get css classes for an block
     * Example {'class-name': true}
     *
     * @returns {DataObject}
     */


    _proto.getCss = function getCss() {
      var cssClasses = {};

      if ('css_classes' in this.getData()) {
        this.getData().css_classes.map(function (value, index) {
          return cssClasses[value] = true;
        });
      }

      return cssClasses;
    };
    /**
     * Get stype properties for an block
     * Example {'backgroundColor': '#cccccc'}
     *
     * @returns {DataObject}
     */


    _proto.getStyle = function getStyle() {
      var styleAttributes = this.getData();
      styleAttributes = this.appearance.add(styleAttributes);
      return this.styleAttributeMapper.toDom(this.styleAttributeFilter.filter(styleAttributes));
    };
    /**
     * Get attributes for an block
     * Example {'data-role': 'element'}
     *
     * @returns {DataObject}
     */


    _proto.getAttributes = function getAttributes() {
      var data = this.getData();

      _underscore.extend(data, this.config);

      return this.attributeMapper.toDom(this.attributeFilter.filter(data));
    };
    /**
     * Get block data
     *
     * @returns {DataObject}
     */


    _proto.getData = function getData() {
      return this.stage.store.get(this.id);
    };

    _createClass(Structural, [{
      key: "options",
      get: function get() {
        return [new _option.Option(this, 'move', '<i></i>', (0, _translate)('Move'), false, ['move-structural'], 10), new _option.Option(this, 'edit', '<i></i>', (0, _translate)('Edit'), this.onOptionEdit, ['edit-block'], 50), new _option.Option(this, 'duplicate', '<i></i>', (0, _translate)('Duplicate'), this.onOptionDuplicate, ['duplicate-structural'], 60), new _option.Option(this, 'remove', '<i></i>', (0, _translate)('Remove'), this.onOptionRemove, ['remove-structural'], 100)];
      }
      /**
       * Retrieve the template for the structural
       *
       * @returns {string}
       */

    }, {
      key: "template",
      get: function get() {
        return 'Gene_BlueFoot/component/stage/structural/abstract.html';
      }
      /**
       * Retrieve the preview child template
       *
       * @returns {string}
       */

    }, {
      key: "previewChildTemplate",
      get: function get() {
        return 'Gene_BlueFoot/component/block/preview/children.html';
      }
      /**
       * Retrieve the child template
       *
       * @returns {string}
       */

    }, {
      key: "renderChildTemplate",
      get: function get() {
        return 'Gene_BlueFoot/component/block/render/children.html';
      }
    }]);

    return Structural;
  }(_editableArea);

  return Structural;
});
//# sourceMappingURL=abstract.js.map
