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
      _this.editOnInsert = true;
      _this.childEntityKeys = [];
      _this.previewTemplate = 'Gene_BlueFoot/component/block/preview/abstract.html';
      _this.renderTemplate = 'Gene_BlueFoot/component/block/render/abstract.html';
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
