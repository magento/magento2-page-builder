define(["./editable-area", "./options", "./options/option", "./column/builder", "../edit", "../../../utils/style-attribute-filter", "../../../utils/style-attribute-mapper", "../../../utils/attribute-filter", "../../../utils/attribute-mapper", "mage/translate", "knockout", "underscore"], function (_editableArea, _options, _option, _builder, _edit, _styleAttributeFilter, _styleAttributeMapper, _attributeFilter, _attributeMapper, _translate, _knockout, _underscore) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  /**
   * Structural class
   *
   * @author Dave Macaulay <dmacaulay@magento.com>
   */
  var Structural =
  /*#__PURE__*/
  function (_EditableArea) {
    _inherits(Structural, _EditableArea);

    /**
     * Abstract structural constructor
     *
     * @param parent
     * @param stage
     * @param config
     */
    function Structural(parent, stage) {
      var _this;

      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      _classCallCheck(this, Structural);

      _this = _possibleConstructorReturn(this, (Structural.__proto__ || Object.getPrototypeOf(Structural)).call(this, stage));
      _this.wrapperStyle = _knockout.observable({
        width: '100%'
      });
      _this.options = [new _option.Option(_this, 'move', '<i></i>', (0, _translate)('Move'), false, ['move-structural'], 10), new _option.Option(_this, 'edit', '<i></i>', (0, _translate)('Edit'), _this.onOptionEdit.bind(_this), ['edit-block'], 50), new _option.Option(_this, 'duplicate', '<i></i>', (0, _translate)('Duplicate'), _this.onOptionDuplicate.bind(_this), ['duplicate-structural'], 60), new _option.Option(_this, 'remove', '<i></i>', (0, _translate)('Remove'), _this.onOptionRemove.bind(_this), ['remove-structural'], 100)];
      _this.optionsInstance = new _options.Options(_this, _this.options);
      _this.children = _knockout.observableArray([]);
      _this.template = 'Gene_BlueFoot/component/stage/structural/abstract.html';
      _this.columnBuilder = new _builder.ColumnBuilder();
      _this.previewChildTemplate = 'Gene_BlueFoot/component/block/preview/children.html';
      _this.renderChildTemplate = 'Gene_BlueFoot/component/block/render/children.html';

      _this.setChildren(_this.children); // Create a new instance of edit for our editing needs


      _this.edit = new _edit(_this, _this.stage.store);
      _this.styleAttributeFilter = new _styleAttributeFilter();
      _this.styleAttributeMapper = new _styleAttributeMapper();
      _this.attributeFilter = new _attributeFilter();
      _this.attributeMapper = new _attributeMapper();
      _this.parent = parent;
      _this.config = config;
      return _this;
    }

    _createClass(Structural, [{
      key: "onOptionEdit",
      value: function onOptionEdit() {
        this.edit.openAndRender();
      }
      /**
       * Handle duplicate of items
       */

    }, {
      key: "onOptionDuplicate",
      value: function onOptionDuplicate() {
        this.parent.duplicateChild(this);
      }
      /**
       * Handle block removal
       */

    }, {
      key: "onOptionRemove",
      value: function onOptionRemove() {
        var _this2 = this;

        this.stage.parent.confirmationDialog({
          title: 'Confirm Item Removal',
          content: 'Are you sure you want to remove this item? The data within this item is not recoverable once removed.',
          actions: {
            confirm: function confirm() {
              // Call the parent to remove the child element
              _this2.parent.emit('blockRemoved', {
                block: _this2
              });
            }
          }
        });
      }
      /**
       * @returns {object}
       */

    }, {
      key: "getCss",
      value: function getCss() {
        var cssClasses = {};

        if ('css_classes' in this.getData()) {
          this.getData().css_classes.map(function (value, index) {
            return cssClasses[value] = true;
          });
        }

        return cssClasses;
      }
      /**
       * @returns {object}
       */

    }, {
      key: "getStyle",
      value: function getStyle() {
        return this.styleAttributeMapper.toDom(this.styleAttributeFilter.filter(this.getData()));
      }
      /**
       * @returns {object}
       */

    }, {
      key: "getAttributes",
      value: function getAttributes() {
        var data = this.getData();

        _underscore.extend(data, this.config);

        return this.attributeMapper.toDom(this.attributeFilter.filter(data));
      }
      /**
       * @returns {object}
       */

    }, {
      key: "getData",
      value: function getData() {
        return this.stage.store.get(this.id);
      }
    }]);

    return Structural;
  }(_editableArea);

  return Structural;
});
//# sourceMappingURL=abstract.js.map
