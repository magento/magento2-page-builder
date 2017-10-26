define(["../stage/structural/abstract", "../stage/previews", "underscore"], function (_abstract, _previews, _underscore) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * AbstractBlock class
   *
   * @author Dave Macaulay <dmacaulay@magento.com>
   */
  var Block =
  /*#__PURE__*/
  function (_Structural) {
    _inheritsLoose(Block, _Structural);

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

      _this = _Structural.call(this, parent, stage, config) || this;
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