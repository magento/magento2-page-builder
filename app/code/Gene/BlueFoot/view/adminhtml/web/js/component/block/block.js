define(["../stage/structural/abstract", "../stage/previews", "underscore"], function (_abstract, _previews, _underscore) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  /**
   * AbstractBlock class
   *
   * @author Dave Macaulay <dmacaulay@magento.com>
   */
  var Block =
  /*#__PURE__*/
  function (_Structural) {
    _inherits(Block, _Structural);

    /**
     * AbstractBlock constructor
     *
     * @param parent
     * @param stage
     * @param config
     * @param formData
     */
    function Block(parent, stage, config, formData) {
      var _this;

      _classCallCheck(this, Block);

      _this = _possibleConstructorReturn(this, (Block.__proto__ || Object.getPrototypeOf(Block)).call(this, parent, stage, config));
      Object.defineProperty(_this, "title", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "editOnInsert", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: true
      });
      Object.defineProperty(_this, "preview", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "childEntityKeys", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: []
      });
      Object.defineProperty(_this, "previewTemplate", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: 'Gene_BlueFoot/component/block/preview/abstract.html'
      });
      Object.defineProperty(_this, "renderTemplate", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: 'Gene_BlueFoot/component/block/render/abstract.html'
      });
      Object.defineProperty(_this, "config", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      _this.preview = (0, _previews)(_this, config);

      if (config.preview_template) {
        _this.previewTemplate = config.preview_template;
      }

      if (config.render_template) {
        _this.renderTemplate = config.render_template;
      }

      var defaults = {};

      if (config.fields) {
        _underscore.each(config.fields, function (field, key) {
          defaults[key] = field.default;
        });
      }

      _this.stage.store.update(_this.id, _underscore.extend(defaults, formData));

      return _this;
    }

    return Block;
  }(_abstract);

  return Block;
});
//# sourceMappingURL=block.js.map
