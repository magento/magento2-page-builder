/*eslint-disable */
define(["knockout", "bluefoot/highlight", "./block"], function (_knockout, _highlight, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  'use strict';

  var Code =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Code, _PreviewBlock);

    /**
     * Constructor
     *
     * @param {Block} parent
     * @param {Object} config
     */
    function Code(parent, config) {
      var _this;

      _this = _PreviewBlock.call(this, parent, config) || this;

      _this.updateDataValue('html', _knockout.observable(''));

      _this.parent.stage.store.subscribe(function (data) {
        _this.updateDataValue('html', _highlight.highlight('html', _this.data.snippet()).value);
      }, _this.parent.id);

      return _this;
    }

    return Code;
  }(_block);

  return Code;
});
//# sourceMappingURL=code.js.map
