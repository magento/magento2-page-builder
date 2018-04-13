/*eslint-disable */
define(["underscore", "Magento_PageBuilder/js/component/block/appearance-config", "Magento_PageBuilder/js/component/stage/previews", "Magento_PageBuilder/js/component/stage/structural/abstract"], function (_underscore, _appearanceConfig, _previews, _abstract) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Block =
  /*#__PURE__*/
  function (_Structural) {
    _inheritsLoose(Block, _Structural);

    /**
     * Block constructor
     *
     * @param {EditableArea} parent
     * @param {string} stageId
     * @param {ConfigContentBlock} config
     * @param formData
     */
    function Block(parent, config, stageId, formData, elementConverterPool, dataConverterPool) {
      var _this;

      _this = _Structural.call(this, parent, config, stageId, elementConverterPool, dataConverterPool) || this;
      _this.title = void 0;
      _this.preview = void 0;
      _this.childEntityKeys = [];
      _this.preview = (0, _previews)(_this, config);
      var defaults = {};

      if (config.fields) {
        _underscore.each(config.fields, function (field, key) {
          defaults[key] = field.default;
        });
      }

      _this.store.update(_this.id, _underscore.extend(defaults, formData));

      return _this;
    }
    /**
     * Retrieve the preview template
     *
     * @returns {string}
     */


    _createClass(Block, [{
      key: "previewTemplate",
      get: function get() {
        var appearance = this.preview.data.appearance ? this.preview.data.appearance() : undefined;
        var template = (0, _appearanceConfig)(this.config.name, appearance).preview_template;

        if (undefined === template) {
          template = "Magento_PageBuilder/component/block/preview/abstract.html";
        }

        return template;
      }
      /**
       * Retrieve the render template
       *
       * @returns {string}
       */

    }, {
      key: "renderTemplate",
      get: function get() {
        var template = (0, _appearanceConfig)(this.config.name, this.getData().appearance).render_template;

        if (undefined === template) {
          template = "Magento_PageBuilder/component/block/render/abstract.html";
        }

        return template;
      }
    }]);

    return Block;
  }(_abstract);

  return Block;
});
//# sourceMappingURL=block.js.map
